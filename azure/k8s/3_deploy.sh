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

# Add Azure DNS label for stable FQDN (instead of changing IP)
echo "🏷️  Adding Azure DNS label for stable FQDN..."
kubectl patch service ingress-nginx-controller -n ingress-nginx -p '{"metadata":{"annotations":{"service.beta.kubernetes.io/azure-dns-label-name":"boring-paper-azure"}}}'

# Wait for ingress controller to be ready
echo "⏳ Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Update image references to use Terraform-created ACR
echo "🔄 Updating image references..."
./2_update-image-refs.sh

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
echo "🌟 Deployment Complete!"
echo ""

# Get ingress IP
INGRESS_IP=$(kubectl get service -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

# Azure FQDN (from DNS label)
AZURE_FQDN="boring-paper-azure.eastus.cloudapp.azure.com"

echo "🔗 Access your application:"
echo "   🌐 FQDN: http://$AZURE_FQDN/"
echo "   📍 IP:   http://$INGRESS_IP/"
echo ""
echo "🖥️  Terminal: ws://$AZURE_FQDN/api/xdr/terminal"
echo "🤖 Chat API: http://$AZURE_FQDN/api/chat"
echo "📚 SDK API:  http://$AZURE_FQDN/api/sdk"
echo ""
echo "✨ Multi-cloud CORS and Azure DNS label working!" 