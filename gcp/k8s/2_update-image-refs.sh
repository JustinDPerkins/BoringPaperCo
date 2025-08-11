#!/bin/bash

# Update image references to use Terraform-created Artifact Registry

set -e

echo "🔄 Updating image references to use Terraform Artifact Registry..."

# Get Artifact Registry base URL from Terraform
REGISTRY_BASE_URL=$(cd ../iac && terraform output -raw artifact_registry_base_url)
PROJECT_ID=$(cd ../iac && terraform output -raw project_id)

echo "📡 Using Artifact Registry: $REGISTRY_BASE_URL"

# Update deployment files
services=("aichat" "containerxdr" "ui" "sdk")

for service in "${services[@]}"; do
    deployment_file="${service}-deployment.yaml"
    if [ -f "$deployment_file" ]; then
        echo "🔧 Updating $deployment_file..."
        
        # Replace placeholder project-id and registry URL with actual Terraform values
        # Pattern: us-central1-docker.pkg.dev/project-id/boringpaperco-SERVICE/boringpaperco/SERVICE:latest
        # Use sed compatible with both macOS and Linux
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|us-central1-docker\.pkg\.dev/project-id|$REGISTRY_BASE_URL|g" "$deployment_file"
        else
            # Linux
            sed -i "s|us-central1-docker\.pkg\.dev/project-id|$REGISTRY_BASE_URL|g" "$deployment_file"
        fi
        
        echo "✅ Updated $service deployment"
    fi
done

echo ""
echo "🎉 All deployment files updated to use: $REGISTRY_BASE_URL"
echo ""
echo "📝 Image references now point to:"
for service in "${services[@]}"; do
    echo "  ✅ $service: $REGISTRY_BASE_URL/boringpaperco-$service/boringpaperco/$service:latest"
done

echo ""
echo "🚀 Next step: Run 3_deploy.sh to deploy to GKE" 