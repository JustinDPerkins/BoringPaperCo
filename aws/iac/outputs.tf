output "cluster_id" {
  description = "EKS cluster ID"
  value       = aws_eks_cluster.main.id
}

output "cluster_arn" {
  description = "EKS cluster ARN"
  value       = aws_eks_cluster.main.arn
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
}

output "node_group_arn" {
  description = "Amazon Resource Name (ARN) of the EKS Node Group"
  value       = aws_eks_node_group.main.arn
}

output "ecr_repository_urls" {
  description = "ECR repository URLs"
  value = {
    for repo_name, repo in aws_ecr_repository.repositories :
    repo_name => repo.repository_url
  }
}

output "vpc_id" {
  description = "ID of the VPC where the cluster is deployed"
  value       = aws_vpc.main.id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "kubectl_config_command" {
  description = "Command to update kubectl config"
  value       = "aws eks --region ${var.region} update-kubeconfig --name ${aws_eks_cluster.main.name}"
}

output "aws_load_balancer_controller_role_arn" {
  description = "ARN of the IAM role for AWS Load Balancer Controller"
  value       = aws_iam_role.aws_load_balancer_controller.arn
}

output "ebs_csi_driver_role_arn" {
  description = "ARN of the IAM role for EBS CSI Driver"
  value       = aws_iam_role.ebs_csi_driver.arn
} 