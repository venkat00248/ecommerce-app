terraform { required_providers { google = { source = "hashicorp/google", version = "~> 6.0" } } }
variable "project_id" { type = string }
variable "region" { type = string, default = "us-central1" }
provider "google" { project = var.project_id, region = var.region }
resource "google_artifact_registry_repository" "ecommerce" { location = var.region, repository_id = "ecommerce", format = "DOCKER" }
resource "google_container_cluster" "ecommerce" { name = "ecommerce", location = var.region, deletion_protection = false, initial_node_count = 1 }