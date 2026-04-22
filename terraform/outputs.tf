output "cloud_run_url" {
  description = "Default Cloud Run URL of the application service. Note: ingress is restricted to the load balancer."
  value       = google_cloud_run_v2_service.app.uri
}

output "load_balancer_ip" {
  description = "Public IP address of the HTTP load balancer."
  value       = google_compute_global_address.lb.address
}

output "artifact_registry_repository" {
  description = "Full path of the Artifact Registry Docker repository."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}"
}

output "wif_provider_resource_name" {
  description = "Full resource name of the Workload Identity provider. Use as the GitHub `WIF_PROVIDER` secret."
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "github_actions_sa_email" {
  description = "Email of the GitHub Actions deploy service account. Use as the GitHub `WIF_SERVICE_ACCOUNT` secret."
  value       = google_service_account.github_actions.email
}

output "db_instance_connection_name" {
  description = "Cloud SQL instance connection name (project:region:instance)."
  value       = google_sql_database_instance.postgres.connection_name
}
