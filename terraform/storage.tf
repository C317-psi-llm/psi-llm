# GCS bucket that holds Terraform remote state.
#
# Bootstrap flow:
#   1. Initial apply uses the local backend (see main.tf). At that point this
#      bucket gets created as a regular resource.
#   2. After the bucket exists, uncomment the `backend "gcs"` block in main.tf
#      and run:
#          terraform init -migrate-state
#      to move state from the local file into this bucket.
#
# If the bucket has been created manually, import it before the first apply:
#   terraform import google_storage_bucket.tfstate <bucket-name>
#
# `prevent_destroy` is set on purpose: deleting this bucket would destroy
# Terraform state history and is almost never what we want.
resource "google_storage_bucket" "tfstate" {
  name     = local.tfstate_bucket_name
  location = var.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = false
  }

  depends_on = [google_project_service.enabled]
}
