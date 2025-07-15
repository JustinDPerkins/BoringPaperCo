# Generate random suffix for resource naming
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# Enable required APIs
resource "google_project_service" "container" {
  service            = "container.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "compute" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "boring-paper-vpc-${random_string.suffix.result}"
  auto_create_subnetworks = false
  depends_on             = [google_project_service.compute]
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "boring-paper-subnet-${random_string.suffix.result}"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
  network       = google_compute_network.vpc.id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

# GKE Standard Cluster
resource "google_container_cluster" "primary" {
  name               = "${var.cluster_name}-${random_string.suffix.result}"
  location           = var.zone
  initial_node_count = 1

  # Allow deletion for sample app
  deletion_protection = false

  # Network configuration
  network    = google_compute_network.vpc.id
  subnetwork = google_compute_subnetwork.subnet.id

  # IP allocation for pods and services
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  # Workload Identity for secure access to GCP services
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Remove default node pool to be replaced by managed node pool
  remove_default_node_pool = true

  # Enable network policy
  network_policy {
    enabled = true
  }

  depends_on = [
    google_project_service.container,
    google_project_service.compute,
  ]
}

# Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = var.zone
  cluster    = google_container_cluster.primary.name
  node_count = var.node_count

  node_config {
    preemptible  = false
    machine_type = var.node_machine_type
    disk_size_gb = var.disk_size
    disk_type    = "pd-standard"

    # Google recommends custom service accounts with minimal permissions
    service_account = google_service_account.gke_nodes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    # Enable Workload Identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    labels = {
      environment = "production"
      project     = "boring-paper-co"
    }

    tags = ["gke-node", "boring-paper-co"]
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  upgrade_settings {
    strategy      = "SURGE"
    max_surge     = 1
    max_unavailable = 0
  }
}

# Service Account for GKE nodes
resource "google_service_account" "gke_nodes" {
  account_id   = "gke-nodes-${random_string.suffix.result}"
  display_name = "GKE Node Service Account"
}

# IAM bindings for node service account
resource "google_project_iam_member" "gke_nodes_registry" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

resource "google_project_iam_member" "gke_nodes_artifactregistry" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

# Artifact Registry for container images
resource "google_artifact_registry_repository" "docker_repo" {
  for_each = toset(var.artifact_registry_repositories)

  location      = var.region
  repository_id = "boringpaperco-${each.value}"
  description   = "Docker repository for ${each.value} service"
  format        = "DOCKER"

  depends_on = [google_project_service.artifactregistry]
}

# IAM binding for Artifact Registry access from GKE
resource "google_artifact_registry_repository_iam_member" "gke_reader" {
  for_each = google_artifact_registry_repository.docker_repo

  project    = var.project_id
  location   = each.value.location
  repository = each.value.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.gke_nodes.email}"
} 