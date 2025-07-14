#!/bin/bash

# Boring Paper Co - Update Image References in Deployment Files

set -e

# Configuration
REGION="${AWS_DEFAULT_REGION:-us-west-2}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🔄 Updating image references in deployment files..."
echo "📍 Region: $REGION"
echo "🔢 Account ID: $ACCOUNT_ID"

# Update deployment files
services=("ui" "sdk" "containerxdr" "aichat")

for service in "${services[@]}"; do
    if [ -f "${service}-deployment.yaml" ]; then
        echo "📝 Updating ${service}-deployment.yaml..."
        sed -i.bak "s/ACCOUNT_ID\.dkr\.ecr\.REGION\.amazonaws\.com/${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/g" "${service}-deployment.yaml"
        rm "${service}-deployment.yaml.bak"
        echo "✅ ${service}-deployment.yaml updated!"
    else
        echo "⚠️  ${service}-deployment.yaml not found, skipping..."
    fi
done

# Update ingress file
if [ -f "ingress.yaml" ]; then
    echo "📝 Updating ingress.yaml..."
    sed -i.bak "s/REGION/${REGION}/g; s/ACCOUNT_ID/${ACCOUNT_ID}/g" ingress.yaml
    rm ingress.yaml.bak
    echo "✅ ingress.yaml updated!"
fi

echo ""
echo "🎉 All deployment files updated!"
echo ""
echo "📋 Updated files:"
for service in "${services[@]}"; do
    if [ -f "${service}-deployment.yaml" ]; then
        echo "  ✓ ${service}-deployment.yaml"
    fi
done
echo "  ✓ ingress.yaml"

echo ""
echo "📝 Next step: Deploy to EKS using:"
echo "   ./deploy.sh" 