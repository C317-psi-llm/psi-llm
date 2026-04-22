resource "google_compute_global_address" "lb" {
  name = "psi-llm-lb-ip"
}

resource "google_compute_backend_service" "app" {
  name                  = "psi-llm-backend"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.serverless_neg.id
  }
}

resource "google_compute_url_map" "app" {
  name            = "psi-llm-url-map"
  default_service = google_compute_backend_service.app.id
}

resource "google_compute_target_http_proxy" "app" {
  name    = "psi-llm-http-proxy"
  url_map = google_compute_url_map.app.id
}

resource "google_compute_global_forwarding_rule" "app" {
  name                  = "psi-llm-forwarding-rule"
  target                = google_compute_target_http_proxy.app.id
  port_range            = "80"
  ip_address            = google_compute_global_address.lb.id
  load_balancing_scheme = "EXTERNAL_MANAGED"
}
