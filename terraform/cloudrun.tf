locals {
  # Bootstrap image used the first time Terraform creates the Cloud Run
  # service, before the application image has been pushed to Artifact
  # Registry. Once CI passes a real image_tag, the conditional below flips
  # to the application image automatically.
  bootstrap_image = "us-docker.pkg.dev/cloudrun/container/hello"
  app_image       = "${var.region}-docker.pkg.dev/${var.project_id}/${local.ar_repository}/app:${var.image_tag}"
  container_image = var.image_tag == "" ? local.bootstrap_image : local.app_image
}

resource "google_service_account" "cloud_run_runtime" {
  account_id   = "psi-llm-runtime"
  display_name = "psi-llm Cloud Run runtime"
}

resource "google_secret_manager_secret_iam_member" "runtime_db_password_access" {
  secret_id = google_secret_manager_secret.db_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}

resource "google_cloud_run_v2_service" "app" {
  name     = "psi-llm"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    service_account = google_service_account.cloud_run_runtime.email

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = local.container_image

      env {
        name  = "DB_HOST"
        value = google_sql_database_instance.postgres.private_ip_address
      }

      env {
        name  = "DB_NAME"
        value = local.db_name
      }

      env {
        name  = "DB_USER"
        value = local.db_user
      }

      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_password.secret_id
            version = "latest"
          }
        }
      }
    }
  }

  depends_on = [
    google_project_service.enabled,
    google_secret_manager_secret_iam_member.runtime_db_password_access,
    google_artifact_registry_repository.app,
  ]
}

# The load balancer's serverless NEG forwards requests as unauthenticated
# invocations. Since ingress is locked to INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER,
# only traffic coming through the LB can reach the service.
resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  project  = google_cloud_run_v2_service.app.project
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_compute_region_network_endpoint_group" "serverless_neg" {
  name                  = "psi-llm-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_v2_service.app.name
  }
}
