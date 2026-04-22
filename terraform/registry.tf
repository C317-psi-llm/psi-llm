resource "google_artifact_registry_repository" "app" {
  location      = var.region
  repository_id = local.ar_repository
  description   = "Docker images for the psi-llm application."
  format        = "DOCKER"
}
