#!/bin/bash

# ⚠️  OBSOLETE - This script is no longer needed!
# ACR creation and AKS integration is now handled by Terraform automatically.
# 
# The ../iac/main.tf file now includes:
# - azurerm_container_registry resource (creates ACR)
# - azurerm_role_assignment resource (gives AKS pull access)
#
# Just run: terraform apply
# Then use: ./build-and-push.sh

echo "🚫 This script is OBSOLETE!"
echo ""
echo "✅ ACR setup is now handled automatically by Terraform"
echo "   Run 'terraform apply' in ../iac directory instead"
echo ""
echo "📝 Next steps:"
echo "1. cd ../iac && terraform apply"
echo "2. ./build-and-push.sh"
echo "3. ./deploy.sh"
exit 0

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