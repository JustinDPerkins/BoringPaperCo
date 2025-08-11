#!/bin/bash

# Boring Paper Co - Build and Push Images to Google Artifact Registry

set -e

echo "🐳 Building and pushing Docker images to Google Artifact Registry..."

# Get Artifact Registry information from Terraform outputs
echo "📋 Getting Artifact Registry information from Terraform..."
REGISTRY_BASE_URL=$(cd ../iac && terraform output -raw artifact_registry_base_url)
PROJECT_ID=$(cd ../iac && terraform output -raw project_id)
REGION=$(cd ../iac && terraform output -raw region)

echo "📡 Registry Base URL: $REGISTRY_BASE_URL"
echo "📡 Project ID: $PROJECT_ID" 
echo "📡 Region: $REGION"

# Configure Docker for Artifact Registry
echo "🔐 Configuring Docker authentication for Artifact Registry..."
gcloud auth configure-docker $REGISTRY_BASE_URL

# Build and push each service
services=("sdk" "containerxdr" "ui" "aichat")

for service in "${services[@]}"; do
    echo "🔨 Building $service..."
    
    # Artifact Registry URL format: region-docker.pkg.dev/project-id/repository-name/image-name:tag
    IMAGE_URL="$REGISTRY_BASE_URL/boringpaperco-$service/boringpaperco/$service:latest"
    
    if [ "$service" == "ui" ]; then
        # Build UI with relative URLs (works with any domain/IP)
        docker build --platform linux/amd64 \
            --build-arg VITE_API_BASE_URL="/api/sdk" \
            --build-arg VITE_AICHAT_URL="/api/chat" \
            --build-arg VITE_OLLAMA_URL="/api/ollama" \
            --build-arg VITE_XDR_WS_URL="/api/xdr/terminal" \
            -t $IMAGE_URL ../../$service
    else
        # Build other services normally
        docker build --platform linux/amd64 -t $IMAGE_URL ../../$service
    fi
    
    echo "📤 Pushing $service..."
    docker push $IMAGE_URL
    
    echo "✅ $service complete!"
done

echo ""
echo "🎉 All images built and pushed to Terraform-created Artifact Registry!"
echo ""
echo "📝 Images pushed to:"
for service in "${services[@]}"; do
    echo "  ✅ $service: $REGISTRY_BASE_URL/boringpaperco-$service/boringpaperco/$service:latest"
done
echo ""
echo "🚀 Next steps:"
echo "1. Update deployment YAML files with these image URLs (if needed)"
echo "2. Run './2_update_refs.sh' to update artifact locations"
echo ""
echo "💡 Note: GKE has automatic pull access via Workload Identity and IAM bindings" 