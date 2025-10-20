variable "region" {
  type        = string
  default     = "us-west-2"
  description = "AWS region"
}

variable "kubernetes_version" {
  type        = string
  default     = "1.32"
  description = "Kubernetes version"
}

variable "node_count" {
  type        = number
  description = "The initial quantity of nodes for the node pool."
  default     = 3
}

variable "node_instance_type" {
  type        = string
  description = "EC2 instance type for EKS worker nodes"
  default     = "t3.xlarge"
}

variable "ecr_repositories" {
  type        = list(string)
  description = "List of ECR repositories to create"
  default     = ["ui", "sdk", "containerxdr", "aichat", "ollama"]
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "production"
} 