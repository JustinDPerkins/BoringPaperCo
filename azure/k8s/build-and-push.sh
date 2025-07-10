#!/bin/bash

# Boring Paper Co - Build and Push Images to ACR

set -e

# Configuration
ACR_NAME="boringrepo"  # Your ACR name
RESOURCE_GROUP="boring_paper_acr_rg"  # Your ACR resource group

echo "🐳 Building and pushing Docker images to ACR..."

# Login to ACR
echo "🔐 Logging into ACR..."
az acr login --name $ACR_NAME

# Get ACR server URL
ACR_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "loginServer" --output tsv)
echo "📡 ACR Server: $ACR_SERVER"

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
echo "🎉 All images built and pushed!"
echo ""
echo "📝 Next step: Update image references in your deployment files:"
for service in "${services[@]}"; do
    echo "  $service: $ACR_SERVER/boringpaperco/$service:latest"
done 