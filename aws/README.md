# Boring Paper Co - AWS EKS Deployment

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **kubectl** installed and connected to EKS cluster
3. **Docker** installed
4. **Terraform** (for infrastructure provisioning)

## API Key Setup

1. **Get your API key** from your authentication provider
2. **Encode it for Kubernetes:**
   ```bash
   echo -n "your-api-key" | base64
   ```
3. **Update `k8s/secret.yaml`** with the encoded value

## Infrastructure Deployment

```bash
cd iac

# Initialize and apply Terraform
terraform init
terraform plan
terraform apply

# Get kubectl config command from output
terraform output kubectl_config_command

# Configure kubectl (use command from output)
aws eks --region <region> update-kubeconfig --name <cluster-name>

# Verify connection
kubectl cluster-info
```

## Application Deployment

```bash
cd k8s

# Make scripts executable
chmod +x *.sh

# 1. Build and push images to ECR
./1_build-and-push.sh

# 2. Update image references in deployment files
./2_update-image-refs.sh

# 3. Deploy to EKS
./3_deploy.sh
```

## Monitoring and Logs

```bash
# Check deployment status
kubectl get pods -n boring-paper-co

# Get load balancer URL
kubectl get service ingress-nginx-controller -n ingress-nginx

# View logs for a service
kubectl logs -f deployment/sdk -n boring-paper-co
```

## Destruction

```bash
# Remove application
./4_cleanup.sh

# Remove infrastructure
cd ../iac
terraform destroy
```

## Scripts

- **`1_build-and-push.sh`** - Build and push Docker images to ECR
- **`2_update-image-refs.sh`** - Update deployment files with ECR URLs
- **`3_deploy.sh`** - Deploy application to EKS
- **`4_cleanup.sh`** - Remove all application resources

