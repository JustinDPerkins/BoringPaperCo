#!/bin/bash

# Boring Paper Co - Build and Push Images to ACR

set -e

echo "🐳 Building and pushing Docker images to ACR..."

# Get ACR information from Terraform outputs
echo "📋 Getting ACR information from Terraform..."
ACR_NAME=$(cd ../iac && terraform output -raw acr_name)
ACR_SERVER=$(cd ../iac && terraform output -raw acr_login_server)

echo "📡 ACR Name: $ACR_NAME"
echo "📡 ACR Server: $ACR_SERVER"

# Login to ACR
echo "🔐 Logging into ACR..."
az acr login --name $ACR_NAME

# Build and push each service
services=("sdk" "containerxdr" "ui" "aichat")

for service in "${services[@]}"; do
    echo "🔨 Building $service..."
    
    if [ "$service" == "ui" ]; then
        # Build UI with relative URLs (works with any domain/IP)
        docker build --platform linux/amd64 \
            --build-arg VITE_API_BASE_URL="/api/sdk" \
            --build-arg VITE_AICHAT_URL="/api/chat" \
            --build-arg VITE_OLLAMA_URL="/api/ollama" \
            --build-arg VITE_XDR_WS_URL="/api/xdr/terminal" \
            -t $ACR_SERVER/boringpaperco/$service:latest ../../$service
    else
        # Build other services normally
        docker build --platform linux/amd64 -t $ACR_SERVER/boringpaperco/$service:latest ../../$service
    fi
    
    echo "📤 Pushing $service..."
    docker push $ACR_SERVER/boringpaperco/$service:latest
    
    echo "✅ $service complete!"
done

echo ""
echo "🎉 All images built and pushed to Terraform-created ACR!"
echo ""
echo "📝 Images pushed to:"
for service in "${services[@]}"; do
    echo "  ✅ $service: $ACR_SERVER/boringpaperco/$service:latest"
done
echo ""
echo "🚀 Next steps:"
echo "1. Run './2_update-image-refs.sh' to update deployment files"
echo "2. Run './3_deploy.sh' to deploy to AKS"
echo ""
echo "💡 Note: AKS has automatic pull access via Terraform role assignment" 