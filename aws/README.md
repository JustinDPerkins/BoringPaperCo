# Boring Paper Co - AWS EKS Deployment

This directory contains the AWS EKS deployment configuration for the Boring Paper Co application.

## Architecture

The application consists of 5 microservices deployed on AWS EKS:
- **UI**: React frontend (Port 80) - Main web interface
- **SDK**: Backend API service (Port 5000) - Core business logic
- **ContainerXDR**: Security monitoring service (Port 8081) - WebSocket-based terminal
- **AI Chat**: AI chat service (Port 5001) - Ollama integration for chat
- **Ollama**: Local LLM service (Port 11434) - phi:latest model for AI responses

**Load Balancer**: AWS Classic ELB (via NGINX Ingress Controller)
**Storage**: EBS volumes via CSI driver for persistent data
**Networking**: AWS VPC with public/private subnets

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **kubectl** installed
3. **Docker** installed
4. **Terraform** (for infrastructure provisioning)
5. **eksctl** (optional, for easier EKS management)

### Required AWS Permissions

Your AWS user/role needs permissions for:
- EKS cluster management
- EC2 instances and networking
- ECR repositories
- IAM roles and policies
- Application Load Balancer

## Infrastructure Setup

### 1. Provision EKS Cluster with Terraform

```bash
cd ../iac

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the infrastructure
terraform apply

# Get the kubectl config command from output
terraform output kubectl_config_command
```

**Important**: The Terraform configuration includes:
- EKS cluster with managed node groups (t3.medium instances)
- VPC with public/private subnets across 2 AZs
- ECR repositories for all 5 services
- **EBS CSI Driver IAM role** (required for PVC volume binding)
- AWS Load Balancer Controller IAM role (optional, not used in simplified setup)

### 2. Configure kubectl

```bash
# Use the command from terraform output (example)
aws eks --region us-west-2 update-kubeconfig --name boring-paper-cluster-b7zkmk

# Verify connection
kubectl cluster-info

# Annotate EBS CSI service account (critical for PVC support)
kubectl annotate serviceaccount ebs-csi-controller-sa -n kube-system \
  eks.amazonaws.com/role-arn=arn:aws:iam::ACCOUNT:role/AmazonEKS_EBS_CSI_DriverRole-SUFFIX
```

## Application Deployment

### 1. Build and Push Container Images

```bash
# Navigate to k8s directory
cd k8s

# Make scripts executable
chmod +x *.sh

# Build and push all services to ECR
./build-and-push.sh

# Update deployment files with correct ECR URLs (if needed)
./update-image-refs.sh
```

### 2. Configure Application

The deployment uses a simplified NGINX ingress approach (not AWS ALB) for reliability and multi-cloud compatibility.

```bash
# Deploy core infrastructure
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Deploy storage
kubectl apply -f pvc.yaml

# Deploy NGINX ingress controller
kubectl apply -f ingress-nginx.yaml

# Deploy all services
kubectl apply -f aichat-deployment.yaml
kubectl apply -f containerxdr-deployment.yaml  
kubectl apply -f sdk-deployment.yaml
kubectl apply -f ui-deployment.yaml
kubectl apply -f ollama-deployment.yaml

# Configure routing rules
kubectl apply -f ingress.yaml
```

### 3. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n boring-paper-co

# Get the load balancer URL
kubectl get service ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## Configuration Files

### Essential Kubernetes Manifests
- `namespace.yaml` - Application namespace (boring-paper-co)
- `configmap.yaml` - Environment configuration and API URLs
- `secret.yaml` - Application secrets  
- `pvc.yaml` - Shared storage volume (10GB)
- `ingress-nginx.yaml` - NGINX ingress controller installation
- `ingress.yaml` - Traffic routing rules

### Service Deployments  
- `aichat-deployment.yaml` - AI chat service + Ollama integration
- `containerxdr-deployment.yaml` - Security terminal with WebSocket
- `sdk-deployment.yaml` - Core backend API
- `ui-deployment.yaml` - React frontend
- `ollama-deployment.yaml` - LLM service + 20GB model storage (includes PVC)

### Utility Scripts
- `build-and-push.sh` - Build Docker images and push to ECR
- `update-image-refs.sh` - Update deployment files with ECR URLs  
- `cleanup.sh` - Remove all application resources

### Alternative Files (Not Used)
- `deploy.sh` - Complex AWS ALB approach (use manual deployment instead)

## Load Balancer Setup

The deployment uses **NGINX Ingress Controller** with AWS Classic ELB for simplified, reliable routing:

**External Load Balancer** (AWS ELB):
- `http://[elb-hostname]/` → All traffic to NGINX

**Internal Routing** (NGINX Ingress):
- `/` → UI service (React app with internal proxying)
- `/api/sdk/*` → SDK service  
- `/api/chat/*` → AI Chat service
- `/api/ollama/*` → Ollama service
- `/api/xdr/*` → ContainerXDR service (WebSocket support)


### Access Your Application

```bash
# Get your application URL
export LB_HOSTNAME=$(kubectl get service ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Application URL: http://$LB_HOSTNAME"
```

### SSL/TLS Configuration (Optional)

For production use with custom domains:
1. Set up AWS Certificate Manager
2. Configure SSL annotations in `ingress.yaml`
3. Update DNS records to point to ELB hostname

## Monitoring and Troubleshooting

### Check Deployment Status

```bash
# Check all pods
kubectl get pods -n boring-paper-co

# Check services  
kubectl get services -n boring-paper-co

# Check ingress controller
kubectl get pods -n ingress-nginx

# Check persistent volumes
kubectl get pvc -n boring-paper-co

# Get load balancer hostname
kubectl get service ingress-nginx-controller -n ingress-nginx
```

### Common Issues and Solutions

**1. PVC Stuck in Pending**
```bash
# Check EBS CSI driver
kubectl get pods -n kube-system | grep ebs-csi

# Verify CSI driver has proper IAM role
kubectl describe serviceaccount ebs-csi-controller-sa -n kube-system

# If missing annotation, add it:
kubectl annotate serviceaccount ebs-csi-controller-sa -n kube-system \
  eks.amazonaws.com/role-arn=arn:aws:iam::ACCOUNT:role/AmazonEKS_EBS_CSI_DriverRole-SUFFIX
```

**2. Ollama Service Issues**
```bash
# Check Ollama pod status
kubectl get pods -n boring-paper-co | grep ollama

# Check model download progress
kubectl logs -n boring-paper-co -l app=ollama -c model-downloader

# Verify internal connectivity
kubectl exec -n boring-paper-co -l app=aichat -- curl -s http://ollama-service:11434/api/tags
```

**3. CORS Errors (403 Forbidden)**
- Update service code to allow ELB origins (`*.elb.amazonaws.com`)
- Rebuild and redeploy affected services
- Services with CORS: `aichat`, `containerxdr`

**4. WebSocket Connection Failures**
```bash
# Check containerxdr logs for origin errors
kubectl logs -n boring-paper-co -l app=containerxdr

# Verify WebSocket upgrade headers in ingress.yaml
```

### View Logs

```bash
# View logs for a specific service
kubectl logs -f deployment/sdk -n boring-paper-co

# View logs for all pods with a label
kubectl logs -f -l app=ui -n boring-paper-co

# Check ingress controller logs
kubectl logs -f deployment/ingress-nginx-controller -n ingress-nginx
```


## Cleanup

### Remove Application

```bash
# Delete all application resources
kubectl delete namespace boring-paper-co
```

### Remove Infrastructure

```bash
cd ../iac
terraform destroy
```

