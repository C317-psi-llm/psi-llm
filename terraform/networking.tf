locals {
  subnet_cidr        = "10.10.0.0/24"
  vpc_connector_cidr = "10.8.0.0/28" # must be /28
}

resource "google_compute_network" "vpc" {
  name                    = "psi-llm-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"

  depends_on = [google_project_service.enabled]
}

resource "google_compute_subnetwork" "private" {
  name                     = "psi-llm-private"
  ip_cidr_range            = local.subnet_cidr
  region                   = var.region
  network                  = google_compute_network.vpc.id
  private_ip_google_access = true
}

# Private services access reservation for Cloud SQL.
# Cloud SQL with a private IP requires a /16 (or smaller) range that is
# peered to the Google services VPC via google_service_networking_connection.
resource "google_compute_global_address" "private_ip_alloc" {
  name          = "psi-llm-private-ip-alloc"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_alloc.name]

  depends_on = [google_project_service.enabled]
}

resource "google_vpc_access_connector" "connector" {
  name          = "psi-llm-connector"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = local.vpc_connector_cidr

  depends_on = [google_project_service.enabled]
}
