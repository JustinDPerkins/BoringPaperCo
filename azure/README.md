# Boring Paper Co - Azure AKS Deployment

Deployment guide for Azure AKS.

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

## 🔑 API Key Setup

### 1. Get Trend Micro API Key
- Access your Trend Micro Vision One dashboard
- Generate an API key for file scanning
- Copy the JWT token

### 2. Create Kubernetes Secret
```bash
cd azure/k8s

# Encode your API key (replace with actual JWT token)
echo -n "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." | base64

# Update secret.yaml with the encoded value
# Then apply:
kubectl apply -f secret.yaml
```

## 🏗️ Infrastructure Deployment

### 1. Provision AKS + ACR
```bash
cd azure/iac

# Copy and customize variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Azure details

# Deploy infrastructure
terraform init
terraform plan
terraform apply

# Get kubectl config command from output
terraform output kubectl_config_command
```

### 2. Configure kubectl
```bash
# Use the command from terraform output
az aks get-credentials --resource-group <rg-name> --name <cluster-name>

# Verify connection
kubectl cluster-info
```

## 🚀 Application Deployment

### 1. Build and Push Images
```bash
cd azure/k8s
chmod +x *.sh
./1_build-and-push.sh
```

### 2. Deploy to AKS
```bash
./3_deploy.sh
```

This automatically:
- Installs NGINX Ingress Controller
- Updates image references
- Deploys all services
- Shows application URLs

## 📊 Monitoring and Logs

### Check Status
```bash
# Pod status
kubectl get pods -n boring-paper-co

# Service status
kubectl get services -n boring-paper-co

# Ingress status
kubectl get ingress -n boring-paper-co
```

### View Logs
```bash
# Service logs
kubectl logs -f deployment/sdk -n boring-paper-co
kubectl logs -f deployment/aichat -n boring-paper-co

# Ingress logs
kubectl logs -f deployment/ingress-nginx-controller -n ingress-nginx
```

### Access Application
```bash
# Get load balancer IP
kubectl get service -n ingress-nginx ingress-nginx-controller

# Azure FQDN (stable across deployments)
echo "http://boring-paper-azure.eastus.cloudapp.azure.com/"
```

## 🗑️ Destruction

### Remove Application
```bash
kubectl delete namespace boring-paper-co
```

### Remove Infrastructure
```bash
cd azure/iac
terraform destroy
```

## 📁 Scripts

- `1_build-and-push.sh` - Build and push Docker images to ACR
- `2_update-image-refs.sh` - Update deployment files
- `3_deploy.sh` - Deploy everything to AKS
