# Architecture — psi-llm

## Overview

psi-llm is a monolithic web application hosted on Google Cloud Platform. The codebase lives in a single GitHub repository and consists of a React frontend and an Express backend. Both are packaged together into a single Docker image, where the backend is responsible for serving the pre-built frontend as static files alongside its API routes.

All cloud infrastructure is provisioned and managed with Terraform. Terraform configuration lives under the `terraform/` folder at the root of the repository. There is no separation between infrastructure and application code repositories — they are intentionally colocated.

---

## Application structure

The application is a monolith comprised of two sub-projects:

- `client/` — a React application built with Vite and TypeScript. During the build process, Vite produces a `dist/` folder containing the compiled static assets.
- `server/` — an Express application that serves the API and, in production, also serves the compiled frontend assets as static files.

The two sub-projects are bundled into a single Docker image. The build process compiles the React app first, copies the resulting `dist/` folder into the server project, and then packages the server — including those static files — into the final image. Express exposes a dedicated route (e.g. `GET /`) that serves `index.html` and the rest of the static assets from the copied `dist/` directory.

There is a single Dockerfile at the root of the repository that orchestrates this multi-step build.

---

## Infrastructure

All resources described below are declared in Terraform under `terraform/` and provisioned via the CI/CD pipeline on every push to `main`. Terraform state is stored remotely in a GCS bucket.

### Terraform remote state

A GCS bucket is used as the Terraform remote backend. This ensures that state is shared across machines and CI runs, and that concurrent applies are safely locked. The backend is configured as follows:

```hcl
terraform {
  backend "gcs" {
    bucket = "<tfstate-bucket-name>"
    prefix = "terraform/state"
  }
}
```

Versioning should be enabled on the bucket so that state files can be recovered in the event of corruption.

### Networking

The application runs inside a **VPC network** with a **dedicated private subnet**. The subnet is used to host resources that should not be publicly accessible, namely Cloud SQL and the VPC Access Connector.

Cloud Run is a serverless environment and does not reside directly inside the subnet. However, it is configured to route outbound traffic to private subnet addresses via a **VPC Access Connector**. This connector is a Google-managed resource provisioned inside the private subnet that acts as a bridge between the serverless Cloud Run environment and the VPC's private network. Without it, Cloud Run would have no path to reach Cloud SQL on its private IP.

Cloud Run is configured with `ingress: INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER`, meaning it rejects all traffic that does not originate from the load balancer. It is not publicly accessible via its default Cloud Run URL.

### Load balancer and Serverless NEG

External HTTPS traffic is handled by a **GCP HTTPS Load Balancer**. It terminates SSL, holds the static external IP address, and routes requests through a URL map to a backend service.

Because Cloud Run is a serverless target, the load balancer cannot connect to it directly. A **Serverless Network Endpoint Group (NEG)** is required as the bridge between the backend service and the Cloud Run service. The Serverless NEG is a regional, zero-cost logical pointer that tells the backend service how to forward requests to a specific Cloud Run service.

The full Terraform resource chain for the load balancer is:

```
google_compute_global_address
  → google_compute_global_forwarding_rule (port 443)
    → google_compute_target_https_proxy
      → google_compute_url_map
        → google_compute_backend_service
          → google_compute_region_network_endpoint_group (Serverless NEG → Cloud Run)
```

### Cloud Run

The application runs as a **Cloud Run service** backed by the single Docker image built in CI. The image is pulled from Artifact Registry on each deployment.

The Cloud Run service is declared in Terraform and accepts the Docker image tag as an input variable. This means that deploying a new version of the application is a `terraform apply` operation with the new image tag passed as a variable — there is no separate deployment step.

```hcl
variable "image_tag" {
  type = string
}

resource "google_cloud_run_v2_service" "app" {
  name     = "psi-llm"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    containers {
      image = "${var.ar_region}-docker.pkg.dev/${var.project_id}/${var.ar_repository}/app:${var.image_tag}"
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }
  }
}
```

### Cloud SQL

The application uses a **Cloud SQL Postgres** instance. It is provisioned without a public IP and is only reachable via its private IP within the VPC subnet. Cloud Run connects to it through the VPC Access Connector described above.

### Artifact Registry

A Docker image repository is provisioned in **Artifact Registry**. The CI/CD pipeline builds and pushes the Docker image to this registry on every deployment. The image is tagged with the Git commit SHA to ensure each revision is uniquely identified and traceable.

---

## CI/CD pipeline

Deployment is handled by a **GitHub Actions** workflow that runs on every push to the `main` branch. The pipeline performs the following steps in order:

1. Authenticate with GCP via OIDC (Workload Identity Federation)
2. Build the React frontend (`npm run build` inside `client/`)
3. Copy the resulting `dist/` folder into the server project
4. Build the Docker image from the root Dockerfile
5. Push the image to Artifact Registry, tagged with the commit SHA
6. Run `terraform init` inside the `terraform/` directory
7. Run `terraform apply -auto-approve -var="image_tag=<commit-sha>"`

Steps 2 through 4 are the build process. The `terraform apply` in step 7 both provisions any infrastructure changes and deploys the new image to Cloud Run in a single operation.

### Authentication — Workload Identity Federation (OIDC)

The pipeline authenticates with GCP using **Workload Identity Federation** rather than long-lived service account JSON keys. When the workflow runs, GitHub's identity provider issues a short-lived OIDC token scoped to the specific repository and workflow. GCP's Workload Identity pool verifies that token and exchanges it for a temporary GCP access token. The token expires in minutes and there are no static credentials to store, rotate, or leak.

#### GCP resources required

The following Terraform resources set up the identity federation:

```hcl
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-deploy"
  display_name = "GitHub Actions Deploy"
}

resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-pool"
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "assertion.repository == 'your-org/psi-llm'"
}

resource "google_service_account_iam_member" "github_wif" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/your-org/psi-llm"
}
```

The `attribute_condition` locks the identity pool to the specific GitHub repository. No other repository can impersonate the service account.

The service account must be granted the IAM roles necessary to manage all Terraform-provisioned resources in the project. For a non-production environment, `roles/editor` at the project level is acceptable. This should be tightened to minimum required roles before promoting to production.

#### Steps outside the codebase

The following must be configured manually before the pipeline can run:

1. **Create the GCS Terraform state bucket** — this must exist before `terraform init` can run, since Terraform cannot create its own backend. Create it manually via the GCP console or `gcloud`, with versioning enabled.

2. **Run the Workload Identity Terraform resources once with local credentials** — the identity pool and provider are themselves Terraform resources, but they need to be applied at least once before the GitHub Actions pipeline can authenticate. Bootstrap this initial apply locally using a personal account or a temporary key.

3. **Add GitHub repository secrets** — once the Workload Identity pool is provisioned, add the following secrets to the GitHub repository under Settings → Secrets and variables → Actions:

   | Secret | Value |
   |---|---|
   | `WIF_PROVIDER` | Full resource name of the Workload Identity provider |
   | `WIF_SERVICE_ACCOUNT` | Email of the `github-actions-deploy` service account |
   | `GCP_PROJECT` | GCP project ID |
   | `AR_REGION` | Artifact Registry region (e.g. `us-central1`) |

4. **Grant the GitHub Actions service account permission to use itself** — Cloud Run deployments via Terraform require `roles/iam.serviceAccountUser` on the service account itself so it can act on its own behalf during the deploy.

#### GitHub Actions workflow

```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}

      - name: Build frontend
        working-directory: ./client
        run: |
          npm ci
          npm run build

      - name: Copy frontend dist to server
        run: cp -r client/dist server/dist

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker ${{ secrets.AR_REGION }}-docker.pkg.dev --quiet

      - name: Build and push image
        run: |
          docker build -t ${{ secrets.AR_REGION }}-docker.pkg.dev/${{ secrets.GCP_PROJECT }}/psi-llm/app:${{ github.sha }} .
          docker push ${{ secrets.AR_REGION }}-docker.pkg.dev/${{ secrets.GCP_PROJECT }}/psi-llm/app:${{ github.sha }}

      - name: Set up Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform init
        working-directory: ./terraform
        run: terraform init

      - name: Terraform apply
        working-directory: ./terraform
        run: terraform apply -auto-approve -var="image_tag=${{ github.sha }}"
```

The `id-token: write` permission on the job is required for GitHub to mint the OIDC token. Without it, the auth step will silently fail.

---

## Terraform structure

### Approach — flat resource declarations organised by file

Resources are declared individually rather than through community Registry modules. Community modules for GCP tend to be comprehensive and opinionated, exposing a large surface area of variables and making implicit decisions about IAM, logging, and alerting that add overhead before the application is mature enough to need them. For a single controlled environment with no repetition across environments, the abstraction costs more than it saves.

Resources are instead declared directly and organised into files by concern. This keeps the configuration flat and readable, makes the blast radius of any change easy to reason about, and is straightforward to refactor into reusable local modules later if a second environment is introduced.

### File layout

```
terraform/
├── main.tf          # terraform block, provider config, backend config
├── variables.tf     # all input variables, including image_tag
├── outputs.tf       # outputs exposed after apply (e.g. Cloud Run URL)
├── networking.tf    # VPC, private subnet, VPC Access Connector
├── cloudrun.tf      # Cloud Run service, Serverless NEG
├── loadbalancer.tf  # global address, forwarding rule, proxy, URL map, backend service
├── database.tf      # Cloud SQL instance and database user
├── registry.tf      # Artifact Registry repository
├── iam.tf           # service accounts, Workload Identity pool and provider, IAM bindings
└── storage.tf       # GCS bucket for Terraform remote state (bootstrapped separately)
```

Each file is independently readable and maps directly to a section of this document. The `main.tf` file anchors the configuration with the provider and backend declarations:

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "<tfstate-bucket-name>"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
```

### Variables

All input variables are declared in `variables.tf`. The most important is `image_tag`, which is the only variable that changes on every deploy. The rest are stable configuration values that rarely change and can be given default values or supplied via a `terraform.tfvars` file that is not committed to the repository.

```hcl
variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "ar_region" {
  type    = string
  default = "us-central1"
}

variable "ar_repository" {
  type    = string
  default = "psi-llm"
}

variable "image_tag" {
  type        = string
  description = "Docker image tag to deploy. Set to the Git commit SHA by CI."
}
```

`image_tag` has no default value intentionally — omitting it causes Terraform to fail loudly rather than silently deploying a stale or undefined image.

### Outputs

`outputs.tf` should expose at minimum the Cloud Run service URL after a successful apply, which is useful for smoke-testing the deployment from CI:

```hcl
output "cloud_run_url" {
  value = google_cloud_run_v2_service.app.uri
}
```

### Notes on the storage.tf file

The GCS bucket that holds Terraform state cannot be managed by the same Terraform configuration it backs — Terraform needs the bucket to exist before it can initialise. The `storage.tf` file is therefore present in the repository for documentation and for potential future use (e.g. managing bucket policies or additional buckets), but the state bucket itself must be created manually before the first `terraform init`. See the bootstrapping steps in the CI/CD section above.

---

## Architecture diagram

The diagram below illustrates the GCP topology described in this document.

![GCP Architecture](../docs/gcp_architecture_vpc_neg_v3.html)
