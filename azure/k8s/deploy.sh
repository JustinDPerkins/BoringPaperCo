#!/bin/bash

# Boring Paper Co - AKS Deployment Script

set -e

echo "🚀 Deploying Boring Paper Co to AKS..."

# Check if kubectl is connected to a cluster
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "❌ kubectl is not connected to a cluster. Please run:"
    echo "   az aks get-credentials --resource-group <rg-name> --name <cluster-name>"
    exit 1
fi

# Install NGINX Ingress Controller if not already installed
echo "📦 Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
echo "⏳ Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Deploy application resources
echo "📋 Deploying application resources..."

# Apply in order due to dependencies
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f pvc.yaml

# Deploy services
kubectl apply -f ollama-deployment.yaml
kubectl apply -f sdk-deployment.yaml
kubectl apply -f containerxdr-deployment.yaml
kubectl apply -f aichat-deployment.yaml
kubectl apply -f ui-deployment.yaml

# Deploy ingress
kubectl apply -f ingress.yaml

echo "✅ Deployment complete!"
echo ""
echo "📊 Checking deployment status..."
kubectl get pods -n boring-paper-co
echo ""
echo "🌐 Services:"
kubectl get services -n boring-paper-co
echo ""
echo "🔗 Ingress:"
kubectl get ingress -n boring-paper-co

echo ""
echo "📝 Next steps:"
echo "1. Update your DNS to point to the ingress IP"
echo "2. Build and push your container images to a registry"
echo "3. Update image references in the deployment files"
echo "4. Add your API_KEY and REGION to secret.yaml" 