# Boring Paper Co - AKS Deployment

This directory contains Kubernetes manifests to deploy the Boring Paper Co application stack to Azure Kubernetes Service (AKS).

## 🏗️ Architecture

- **sdk**: Backend API service (Go)
- **containerxdr**: Security monitoring service (Go)
- **ui**: React frontend application
- **ollama**: AI model inference service
- **aichat**: AI chat service (Go)

## 🚀 Prerequisites

1. **AKS Cluster** deployed via Terraform (see `../iac/`)
2. **kubectl** configured for your AKS cluster
3. **Azure Container Registry** (`boringrepo.azurecr.io`) in resource group `boring_paper_acr_rg`
4. **Domain name** for external access

## 📦 Quick Start

### 1. Connect to your AKS cluster
```bash
az aks get-credentials --resource-group $(terraform output -raw resource_group_name) --name $(terraform output -raw kubernetes_cluster_name)
```

### 2. Setup ACR integration with AKS
```bash
chmod +x *.sh
./setup-acr.sh
```

### 3. Update secrets
Edit `secret.yaml` and add your base64-encoded API_KEY and REGION:
```bash
echo -n "your-api-key" | base64
echo -n "your-region" | base64
```

### 4. Build and push container images
```bash
./build-and-push.sh
```

### 5. Deploy the application
```bash
./deploy.sh
```

## 🐳 Container Images

Your images will be stored in your ACR:
- `boringrepo.azurecr.io/boringpaperco/sdk:latest`
- `boringrepo.azurecr.io/boringpaperco/containerxdr:latest`
- `boringrepo.azurecr.io/boringpaperco/ui:latest`
- `boringrepo.azurecr.io/boringpaperco/aichat:latest`

The `build-and-push.sh` script automatically builds and pushes all images to your ACR.

## 🌐 External Access

The ingress is configured for `boringpaper.example.com`. Update `ingress.yaml` with your actual domain name.

### Get Ingress IP
```bash
kubectl get ingress -n boring-paper-co
```

### Update DNS
Point your domain to the ingress external IP address.

## 📊 Monitoring

### Check deployment status
```bash
kubectl get pods -n boring-paper-co
kubectl get services -n boring-paper-co
kubectl logs -n boring-paper-co deployment/sdk
```

### Access applications
- **UI**: https://boringpaper.example.com
- **SDK API**: https://boringpaper.example.com/api/sdk
- **XDR API**: https://boringpaper.example.com/api/xdr
- **Chat API**: https://boringpaper.example.com/api/chat

## 🗑️ Cleanup

```bash
kubectl delete namespace boring-paper-co
```

## 📁 File Overview

- `namespace.yaml` - Application namespace
- `configmap.yaml` - Environment variables
- `secret.yaml` - Sensitive configuration
- `pvc.yaml` - Persistent storage for Ollama
- `*-deployment.yaml` - Service deployments and services
- `ingress.yaml` - External access configuration
- `setup-acr.sh` - ACR integration setup script
- `build-and-push.sh` - Image build and push script
- `deploy.sh` - Deployment automation script

## 🔧 Troubleshooting

### Pods not starting
```bash
kubectl describe pod -n boring-paper-co <pod-name>
kubectl logs -n boring-paper-co <pod-name>
```

### Image pull errors
```bash
# Check if ACR is properly attached
az aks show -g <aks-rg> -n <aks-name> --query "servicePrincipalProfile"

# Re-run ACR setup if needed
./setup-acr.sh
```

### Ingress not working
```bash
kubectl describe ingress -n boring-paper-co boring-paper-ingress
kubectl get events -n boring-paper-co
```

### Storage issues
```bash
kubectl describe pvc -n boring-paper-co ollama-data
``` 