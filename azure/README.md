# Boring Paper Co - Azure AKS Deployment

This directory contains the Azure AKS deployment configuration for the Boring Paper Co application, featuring automated ACR creation and multi-cloud compatibility.

## 🏗️ Architecture

The application consists of 5 microservices deployed on Azure AKS:
- **UI**: React frontend (Port 80) - Main web interface
- **SDK**: Backend API service (Port 5000) - Core business logic
- **ContainerXDR**: Security monitoring service (Port 8081) - WebSocket-based terminal
- **AI Chat**: AI chat service (Port 5001) - Ollama integration for chat
- **Ollama**: Local LLM service (Port 11434) - phi:latest model for AI responses

**Load Balancer**: NGINX Ingress Controller (consistent across AWS/Azure/GCP)
**Storage**: Azure Files for persistent data
**Container Registry**: Azure Container Registry (ACR) - automatically created by Terraform
**Networking**: Azure CNI with kubenet plugin

## 🚀 Prerequisites

1. **Azure CLI** configured with appropriate permissions
2. **kubectl** installed
3. **Docker** installed
4. **Terraform** (for infrastructure provisioning)

### Required Azure Permissions

Your Azure user/service principal needs permissions for:
- AKS cluster management
- Container registry operations
- Resource group management
- Network configuration
- Role assignments

## 📦 Infrastructure Setup

### 1. Provision AKS Cluster + ACR with Terraform

```bash
cd ../iac

# Initialize Terraform
terraform init

# Review the plan (should show AKS + ACR resources)
terraform plan

# Apply the infrastructure
terraform apply

# Get the kubectl config command from output
terraform output kubectl_config_command
```

**Important**: The Terraform configuration now includes:
- AKS cluster with managed node groups (Standard_D2_v2 instances)
- **Azure Container Registry (ACR)** with automatic name generation
- **Role assignment** for AKS to pull from ACR automatically
- Resource group with randomized naming

### 2. Configure kubectl

```bash
# Use the command from terraform output (example)
az aks get-credentials --resource-group rg-boring-paper-abc123 --name boring-paper-cluster-xyz456

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

# Build and push all services to Terraform-created ACR
./build-and-push.sh

# Note: ACR integration is automatic via Terraform role assignment
```

### 2. Deploy to AKS

```bash
# Deploy core infrastructure
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Deploy storage
kubectl apply -f pvc.yaml

# Deploy all services
kubectl apply -f aichat-deployment.yaml
kubectl apply -f containerxdr-deployment.yaml  
kubectl apply -f sdk-deployment.yaml
kubectl apply -f ui-deployment.yaml
kubectl apply -f ollama-deployment.yaml

# Configure NGINX ingress and routing
kubectl apply -f ingress.yaml
```

### 3. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n boring-paper-co

# Get the load balancer IP
kubectl get ingress -n boring-paper-co
```

## 🐳 Container Images

Your images are automatically stored in the **Terraform-created ACR**:
- `<acr-name>.azurecr.io/boringpaperco/sdk:latest`
- `<acr-name>.azurecr.io/boringpaperco/containerxdr:latest`  
- `<acr-name>.azurecr.io/boringpaperco/ui:latest`
- `<acr-name>.azurecr.io/boringpaperco/aichat:latest`
- `<acr-name>.azurecr.io/boringpaperco/ollama:latest`

**Get your ACR details:**
```bash
cd ../iac
terraform output acr_name
terraform output acr_login_server
terraform output acr_repository_urls
```

The `build-and-push.sh` script automatically discovers your ACR from Terraform outputs and pushes all images.

## 🌐 Load Balancer Setup

The deployment uses **NGINX Ingress Controller** for simplified, reliable routing:

**External Load Balancer** (Azure Load Balancer):
- `http://[azure-lb-ip]/` → All traffic to NGINX

**Internal Routing** (NGINX Ingress):
- `/` → UI service (React app with internal proxying)
- `/api/sdk/*` → SDK service  
- `/api/chat/*` → AI Chat service
- `/api/ollama/*` → Ollama service
- `/api/xdr/*` → ContainerXDR service (WebSocket support)

**Key Features**:
- ✅ WebSocket support for terminal functionality
- ✅ CORS configured for multi-cloud deployments  
- ✅ Simple setup, no Azure-specific dependencies
- ✅ Works identically across AWS, Azure, GCP

### Access Your Application

```bash
# Get your application URL
kubectl get ingress -n boring-paper-co -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'

# Or get the service IP directly  
kubectl get service ingress-nginx-controller -n ingress-nginx
```

### SSL/TLS Configuration (Optional)

For production use with custom domains:
1. Set up Azure DNS and SSL certificates
2. Configure SSL annotations in `ingress.yaml`
3. Update DNS records to point to load balancer IP

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
kubectl get ingress -n boring-paper-co
```

### Common Issues and Solutions

**1. ACR Authentication Issues**
```bash
# Verify ACR integration
az aks show --resource-group <rg-name> --name <cluster-name> --query "identityProfile"

# Check role assignments
terraform output acr_name
az role assignment list --scope $(terraform output -raw acr_name)
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
- Services include CORS support for Azure patterns (`.cloudapp.azure.com`, public IPs)
- If deploying to different domains, update CORS origins in service code
- Services with CORS: `aichat`, `containerxdr`

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

Get your load balancer IP and access:
- **UI**: `http://[load-balancer-ip]/`
- **SDK API**: `http://[load-balancer-ip]/api/sdk`
- **XDR Terminal**: `http://[load-balancer-ip]/api/xdr`
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
- `pvc.yaml` - Shared storage volume for Ollama models
- `ingress.yaml` - NGINX ingress routing rules

### Service Deployments  
- `aichat-deployment.yaml` - AI chat service + Ollama integration
- `containerxdr-deployment.yaml` - Security terminal with WebSocket
- `sdk-deployment.yaml` - Core backend API
- `ui-deployment.yaml` - React frontend
- `ollama-deployment.yaml` - LLM service with model storage

### Utility Scripts
- `build-and-push.sh` - Build Docker images and push to Terraform-created ACR
- `deploy.sh` - Manual deployment script for all resources

### Legacy Files (Obsolete)
- `setup-acr.sh` - ⚠️ **OBSOLETE** - ACR setup now handled by Terraform automatically

## 🔄 Azure vs AWS Comparison

| Component | Azure AKS | AWS EKS | Notes |
|-----------|-----------|---------|-------|
| Container Registry | **ACR (Terraform)** | ECR (Terraform) | Now automated on both! |
| Load Balancer | NGINX Ingress | NGINX Ingress | Same approach for consistency |
| Storage Class | `azurefile` | `gp2` (EBS) | Different underlying storage |
| Authentication | Managed Identity | IAM Roles | Azure simpler for ACR integration |
| Networking | kubenet | AWS VPC CNI | Both work well |
| Volume Provisioning | **Automatic** | Manual CSI setup | Azure advantage |
| CORS Origins | `.cloudapp.azure.com` | `.elb.amazonaws.com` | Multi-cloud CORS support |

### Key Migration Insights

**What Works the Same:**
- ✅ NGINX Ingress Controller (consistent approach across clouds)
- ✅ Application code and container images
- ✅ Kubernetes manifests (minimal changes needed)
- ✅ Service mesh and internal networking

**Azure Advantages:**
- 🚀 **Simpler ACR integration** - Built-in managed identity support
- 🚀 **Automatic volume provisioning** - No CSI driver setup required
- 🚀 **Unified billing** - All Azure services in one account

**Lessons Learned:**
- Simple approaches (NGINX) work better than cloud-specific ones
- Terraform automation is crucial for reproducible infrastructure  
- Multi-cloud CORS configuration prevents migration headaches
- Consistent architecture reduces operational complexity 