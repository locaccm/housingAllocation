module "service_account_housingallocation-service" {
  source       = "./modules/service_account"
  account_id   = "housingallocation-service"
  display_name = "Housing Allocation Service Account"
  project_id   = "intricate-pad-455413-f7"
  roles        = [
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor",
    "roles/artifactregistry.reader"
  ]
}