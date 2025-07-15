# Boring Paper Co - GCP GKE Deployment

This directory contains the GCP GKE deployment configuration for the Boring Paper Co application.

## 🏗️ Architecture

The application consists of 5 microservices deployed on GCP GKE Standard:
- **UI**: React frontend (Port 80) - Main web interface
- **SDK**: Backend API service (Port 5000) - Core business logic  
- **ContainerXDR**: Security monitoring service (Port 8081) - WebSocket-based terminal
- **AI Chat**: AI chat service (Port 5001) - Ollama integration for chat
- **Ollama**: Local LLM service (Port 11434) - phi:latest model for AI responses

**Load Balancer**: NGINX Ingress Controller (consistent across AWS/Azure/GCP)
**Storage**: Google Persistent Disks (standard-rwo)
**Container Registry**: Google Artifact Registry - automatically created by Terraform
**Networking**: VPC-native with IP aliasing for pods and services

## 🚀 Prerequisites

1. **Google Cloud CLI** (`gcloud`) configured with appropriate permissions
2. **kubectl** installed
3. **Docker** installed
4. **Terraform** (for infrastructure provisioning)

### Required GCP Permissions

Your GCP user/service account needs permissions for:
- GKE cluster management
- Artifact Registry operations
- VPC and subnet management
- Service account creation
- IAM role assignments

### GCP APIs Required

The Terraform configuration will automatically enable:
- Kubernetes Engine API (`container.googleapis.com`)
- Artifact Registry API (`artifactregistry.googleapis.com`)
- Compute Engine API (`compute.googleapis.com`)

## 📦 Infrastructure Setup

### 1. Provision GKE Cluster + Artifact Registry with Terraform

```bash
cd ../iac

# Copy and customize variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your GCP project ID and preferences

# Initialize Terraform
terraform init

# Review the plan (should show GKE + Artifact Registry resources)
terraform plan

# Apply the infrastructure
terraform apply

# Get the kubectl config command from output
terraform output kubectl_config_command
```

**Important**: The Terraform configuration includes:
- GKE Standard cluster (not Autopilot) with managed node groups
- **Google Artifact Registry** with automatic repository creation
- **Workload Identity** for secure access to GCP services  
- **IAM bindings** for GKE to pull from Artifact Registry automatically
- VPC with secondary IP ranges for pods and services

### 2. Configure kubectl

```bash
# Use the command from terraform output (example)
gcloud container clusters get-credentials boringpaperco-gcp-abc123 --region us-central1 --project your-project-id

# Verify connection
kubectl cluster-info
```

## 🚀 Application Deployment

### 1. Build and Push Container Images

```bash
# Navigate to k8s directory
cd k8s

# Make scripts executable
chmod +x *.sh

# Build and push all services to Terraform-created Artifact Registry
./build-and-push.sh

# Note: Artifact Registry integration is automatic via Workload Identity
```

### 2. Deploy to GKE

```bash
# Automated deployment (recommended)
./deploy.sh

# This automatically:
# - Installs NGINX Ingress Controller  
# - Updates image references to use Terraform Artifact Registry
# - Deploys all services and configurations
# - Shows application URLs when complete
```

### Manual Deployment (Alternative)

```bash
# If you prefer manual control
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f pvc.yaml

# Deploy all services
kubectl apply -f ollama-deployment.yaml
kubectl apply -f sdk-deployment.yaml
kubectl apply -f containerxdr-deployment.yaml
kubectl apply -f aichat-deployment.yaml  
kubectl apply -f ui-deployment.yaml

kubectl apply -f ingress.yaml
```

### 3. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n boring-paper-co

# Get the load balancer IP
kubectl get service -n ingress-nginx ingress-nginx-controller
```

## 🐳 Container Images

Your images are automatically stored in the **Terraform-created Artifact Registry**:
- `<region>-docker.pkg.dev/<project-id>/boringpaperco-sdk/boringpaperco/sdk:latest`
- `<region>-docker.pkg.dev/<project-id>/boringpaperco-containerxdr/boringpaperco/containerxdr:latest`
- `<region>-docker.pkg.dev/<project-id>/boringpaperco-ui/boringpaperco/ui:latest`  
- `<region>-docker.pkg.dev/<project-id>/boringpaperco-aichat/boringpaperco/aichat:latest`

**Get your Artifact Registry details:**
```bash
cd ../iac
terraform output artifact_registry_base_url
terraform output container_image_urls
terraform output artifact_registry_repositories
```

The `build-and-push.sh` script automatically discovers your Artifact Registry from Terraform outputs and pushes all images.

## 🌐 Load Balancer Setup

The deployment uses **NGINX Ingress Controller** for simplified, reliable routing:

**External Load Balancer** (Google Cloud Load Balancer):
- `http://[gcp-lb-ip]/` → All traffic to NGINX

**Internal Routing** (NGINX Ingress):
- `/` → UI service (React app with internal proxying)
- `/api/sdk/*` → SDK service
- `/api/chat/*` → AI Chat service  
- `/api/ollama/*` → Ollama service
- `/api/xdr/*` → ContainerXDR service (WebSocket support)

**Key Features**:
- ✅ WebSocket support for terminal functionality
- ✅ CORS configured for multi-cloud deployments
- ✅ Simple setup, no GCP-specific dependencies
- ✅ Works identically across AWS, Azure, GCP

### Access Your Application

**After running `./deploy.sh`, you'll see:**

```bash
🌟 Deployment Complete!

🔗 Access your application:
   📍 GCP Load Balancer: http://34.102.136.180/

🖥️  Terminal: ws://34.102.136.180/api/xdr/terminal
🤖 Chat API: http://34.102.136.180/api/chat
📚 SDK API:  http://34.102.136.180/api/sdk
🧠 Ollama API: http://34.102.136.180/api/ollama
```

**Manual URL Discovery:**
```bash
# Get load balancer IP
kubectl get service -n ingress-nginx ingress-nginx-controller

# Access via IP
echo "http://$(kubectl get service -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')/"
```

### SSL/TLS Configuration (Optional)

For production use with custom domains:
1. Set up Cloud DNS and SSL certificates
2. Configure SSL annotations in `ingress.yaml`
3. Use cert-manager for automatic certificate management

## 📊 Monitoring and Troubleshooting

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

# Get load balancer status
kubectl get service -n ingress-nginx ingress-nginx-controller
```

### Common Issues and Solutions

**1. Artifact Registry Authentication Issues**
```bash
# Verify Workload Identity setup
kubectl describe serviceaccount -n kube-system

# Check IAM bindings
gcloud projects get-iam-policy YOUR_PROJECT_ID --flatten="bindings[].members" --filter="bindings.members:*gke*"

# Manual Docker auth (if needed)
gcloud auth configure-docker us-central1-docker.pkg.dev
```

**2. Ollama Service Issues**
```bash
# Check Ollama pod status
kubectl get pods -n boring-paper-co | grep ollama

# Check model download progress
kubectl logs -n boring-paper-co -l app=ollama

# Verify internal connectivity
kubectl exec -n boring-paper-co -l app=aichat -- curl -s http://ollama-service:11434/api/tags
```

**3. CORS Errors (403 Forbidden)**
- ✅ **Fixed**: Services now include standardized CORS for GCP patterns
- **Supported Origins**: `*.run.app`, `*.elb.amazonaws.com`, `*.cloudapp.azure.com`
- **WebSocket Terminal**: Works with GCP Load Balancer IPs
- **Services with CORS**: `aichat`, `containerxdr` (both standardized)

```bash
# Check CORS logs if needed
kubectl logs -n boring-paper-co -l app=containerxdr | grep "origin"
```

**4. WebSocket Connection Failures**
```bash
# Check containerxdr logs for origin errors
kubectl logs -n boring-paper-co -l app=containerxdr

# Verify WebSocket upgrade headers in ingress
kubectl describe ingress -n boring-paper-co
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

### Access Applications

**Recommended (GCP Load Balancer):**
- **UI**: `http://[load-balancer-ip]/`
- **SDK API**: `http://[load-balancer-ip]/api/sdk`
- **XDR Terminal**: `ws://[load-balancer-ip]/api/xdr/terminal`
- **Chat API**: `http://[load-balancer-ip]/api/chat`
- **Ollama API**: `http://[load-balancer-ip]/api/ollama`

## 🗑️ Cleanup

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

## 📁 Configuration Files

### Essential Kubernetes Manifests
- `namespace.yaml` - Application namespace (boring-paper-co)
- `configmap.yaml` - Environment configuration and API URLs
- `secret.yaml` - Application secrets
- `pvc.yaml` - Shared storage volume for Ollama models (GCP Persistent Disk)

### Service Deployments
- `aichat-deployment.yaml` - AI chat service + Ollama integration
- `containerxdr-deployment.yaml` - Security terminal with WebSocket
- `sdk-deployment.yaml` - Core backend API
- `ui-deployment.yaml` - React frontend
- `ollama-deployment.yaml` - LLM service with model storage

### Utility Scripts
- `build-and-push.sh` - Build Docker images and push to Terraform-created Artifact Registry
- `deploy.sh` - **Automated deployment script** with image reference updates
- `update-image-refs.sh` - Updates deployment files to use Terraform Artifact Registry (called by deploy.sh)

### Features
- ✅ **Terraform Artifact Registry**: Automated container registry with proper IAM
- ✅ **Workload Identity**: Secure access to GCP services without service account keys
- ✅ **Multi-cloud CORS**: Standardized across AWS/Azure/GCP patterns
- ✅ **Zero-config Deployment**: Single command deploys everything
- ✅ **GKE Standard**: Full control over cluster configuration (not Autopilot)
