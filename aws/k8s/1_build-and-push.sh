#!/bin/bash

# Boring Paper Co - Build and Push Images to ECR

set -e

# Configuration
REGION="${AWS_DEFAULT_REGION:-us-west-2}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🐳 Building and pushing Docker images to ECR..."
echo "📍 Region: $REGION"
echo "🔢 Account ID: $ACCOUNT_ID"

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push each service
services=("sdk" "containerxdr" "ui" "aichat")

for service in "${services[@]}"; do
    echo "🔨 Building $service..."
    
    # Create repository if it doesn't exist
    aws ecr create-repository --repository-name boringpaperco/$service --region $REGION 2>/dev/null || true
    
    if [ "$service" == "ui" ]; then
        # Build UI with relative URLs (works with any domain/IP)
        docker build --platform linux/amd64 \
            --build-arg VITE_API_BASE_URL="/api/sdk" \
            --build-arg VITE_AICHAT_URL="/api/chat" \
            --build-arg VITE_OLLAMA_URL="/api/ollama" \
            --build-arg VITE_XDR_WS_URL="/api/xdr/terminal" \
            -t $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/boringpaperco/$service:latest ../../$service
    else
        # Build other services normally
        docker build --platform linux/amd64 -t $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/boringpaperco/$service:latest ../../$service
    fi
    
    echo "📤 Pushing $service..."
    docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/boringpaperco/$service:latest
    
    echo "✅ $service complete!"
done

echo ""
echo "🎉 All images built and pushed!"
echo ""
echo "📝 Next step: Update image references in your deployment files:"
for service in "${services[@]}"; do
    echo "  $service: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/boringpaperco/$service:latest"
done

echo ""
echo "💡 To update deployment files automatically, run:"
echo "   ./2_update-image-refs.sh" 