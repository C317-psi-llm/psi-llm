locals {
  db_name = "psi_llm"
  db_user = "psi_llm_app"
}

resource "google_sql_database_instance" "postgres" {
  name             = "psi-llm-postgres"
  database_version = "POSTGRES_15"
  region           = var.region

  deletion_protection = false

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_type         = "PD_HDD"
    disk_size         = 10
    activation_policy = "ALWAYS"

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }

    backup_configuration {
      enabled                        = false
      point_in_time_recovery_enabled = false
    }
  }

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
    google_project_service.enabled,
  ]
}

resource "google_sql_database" "app" {
  name     = local.db_name
  instance = google_sql_database_instance.postgres.name
}

resource "random_password" "db" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "google_sql_user" "app" {
  name     = local.db_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.db.result
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "psi-llm-db-password"

  replication {
    auto {}
  }

  depends_on = [google_project_service.enabled]
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db.result
}
