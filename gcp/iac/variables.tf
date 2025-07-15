variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
  default     = "boringpaperco-gcp"
}

variable "node_count" {
  description = "Number of nodes in the default node pool"
  type        = number
  default     = 3
}

variable "node_machine_type" {
  description = "Machine type for cluster nodes"
  type        = string
  default     = "e2-medium"
}

variable "disk_size" {
  description = "Disk size for cluster nodes (GB)"
  type        = number
  default     = 20
}

variable "artifact_registry_repositories" {
  description = "List of Artifact Registry repositories to create"
  type        = list(string)
  default     = ["aichat", "containerxdr", "ui", "sdk", "ollama"]
} 