#!/bin/bash

# Boring Paper Co - ACR Setup Script
# This script attaches your ACR to your AKS cluster for seamless image pulling

set -e

echo "🔗 Setting up ACR integration with AKS..."

# Configuration
ACR_NAME="boringrepo"
ACR_RG="boring_paper_acr_rg"

# Get AKS cluster info from terraform outputs
echo "📋 Getting AKS cluster information..."
AKS_RG=$(cd ../iac && terraform output -raw resource_group_name)
AKS_NAME=$(cd ../iac && terraform output -raw kubernetes_cluster_name)

echo "📍 AKS Cluster: $AKS_NAME in $AKS_RG"
echo "📍 ACR Registry: $ACR_NAME in $ACR_RG"

# Attach ACR to AKS cluster
echo "🔗 Attaching ACR to AKS cluster..."
az aks update \
    --resource-group "$AKS_RG" \
    --name "$AKS_NAME" \
    --attach-acr "$ACR_NAME"

echo "✅ ACR integration complete!"
echo ""
echo "📝 Your AKS cluster can now pull images from:"
echo "   boringrepo.azurecr.io/boringpaperco/*"
echo ""
echo "🚀 Next steps:"
echo "1. Run ./build-and-push.sh to build and push your images"
echo "2. Run ./deploy.sh to deploy to Kubernetes" 