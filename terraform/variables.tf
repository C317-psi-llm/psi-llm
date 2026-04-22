variable "project_id" {
  type        = string
  description = "GCP project ID where all resources are provisioned."
  default     = "llm-psi"
}

variable "region" {
  type        = string
  description = "Default region for all regional resources (Cloud Run, Cloud SQL, VPC subnet, VPC connector, Artifact Registry)."
  default     = "us-central1"
}

variable "image_tag" {
  type        = string
  description = "Docker image tag to deploy. Set to the Git commit SHA by CI. Leave empty during the initial bootstrap to deploy the public hello-world image."
  default     = ""
}
