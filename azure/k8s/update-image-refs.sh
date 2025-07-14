#!/bin/bash

# Update image references to use Terraform-created ACR

set -e

echo "🔄 Updating image references to use Terraform ACR..."

# Get ACR server from Terraform
ACR_SERVER=$(cd ../iac && terraform output -raw acr_login_server)
echo "📡 Using ACR: $ACR_SERVER"

# Update deployment files
services=("aichat" "containerxdr" "ui" "sdk")

for service in "${services[@]}"; do
    deployment_file="${service}-deployment.yaml"
    if [ -f "$deployment_file" ]; then
        echo "🔧 Updating $deployment_file..."
        # Replace hardcoded ACR with Terraform ACR
        sed -i.bak "s|boringrepo\.azurecr\.io|$ACR_SERVER|g" "$deployment_file"
        echo "✅ Updated $service deployment"
    fi
done

echo ""
echo "🎉 All deployment files updated to use: $ACR_SERVER"
echo ""
echo "📝 Image references now point to:"
for service in "${services[@]}"; do
    echo "  ✅ $service: $ACR_SERVER/boringpaperco/$service:latest"
done 