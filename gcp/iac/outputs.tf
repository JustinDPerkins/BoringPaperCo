# Cluster information
output "cluster_name" {
  description = "GKE cluster name"
  value       = google_container_cluster.primary.name
}

output "cluster_location" {
  description = "GKE cluster location"
  value       = google_container_cluster.primary.location
}

output "cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = google_container_cluster.primary.endpoint
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "GKE cluster CA certificate"
  value       = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
  sensitive   = true
}

# kubectl configuration command
output "kubectl_config_command" {
  description = "Command to configure kubectl"
  value       = "gcloud container clusters get-credentials ${google_container_cluster.primary.name} --region ${google_container_cluster.primary.location} --project ${var.project_id}"
}

# Project information
output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP region"
  value       = var.region
}

# Artifact Registry information
output "artifact_registry_repositories" {
  description = "Artifact Registry repository details"
  value = {
    for repo_name, repo in google_artifact_registry_repository.docker_repo :
    repo_name => {
      name     = repo.name
      location = repo.location
      url      = "${repo.location}-docker.pkg.dev/${var.project_id}/${repo.name}"
    }
  }
}

output "artifact_registry_base_url" {
  description = "Base URL for Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}"
}

output "container_image_urls" {
  description = "Full container image URLs for each service"
  value = {
    for repo_name in var.artifact_registry_repositories :
    repo_name => "${var.region}-docker.pkg.dev/${var.project_id}/boringpaperco-${repo_name}/boringpaperco/${repo_name}:latest"
  }
}

# Service account information
output "gke_service_account_email" {
  description = "GKE node service account email"
  value       = google_service_account.gke_nodes.email
}

# Network information
output "vpc_name" {
  description = "VPC network name"
  value       = google_compute_network.vpc.name
}

output "subnet_name" {
  description = "Subnet name"
  value       = google_compute_subnetwork.subnet.name
}

# Useful commands
output "useful_commands" {
  description = "Useful commands for working with this cluster"
  value = {
    kubectl_config    = "gcloud container clusters get-credentials ${google_container_cluster.primary.name} --region ${google_container_cluster.primary.location} --project ${var.project_id}"
    docker_auth       = "gcloud auth configure-docker ${var.region}-docker.pkg.dev"
    view_cluster      = "gcloud container clusters describe ${google_container_cluster.primary.name} --region ${google_container_cluster.primary.location}"
    list_nodes        = "kubectl get nodes"
    cluster_info      = "kubectl cluster-info"
  }
} 