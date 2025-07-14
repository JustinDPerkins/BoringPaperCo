#!/bin/bash

# Boring Paper Co - EKS Deployment Script
# Uses NGINX Ingress instead of AWS Load Balancer Controller for simplicity

set -e

echo "🚀 Deploying Boring Paper Co to EKS (Simple Mode)..."

# Set your region here or export AWS_REGION before running
AWS_REGION="${AWS_REGION:-us-west-2}"

# Check if kubectl is connected to a cluster
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "❌ kubectl is not connected to a cluster. Please run:"
    echo "   aws eks --region <region> update-kubeconfig --name <cluster-name>"
    exit 1
fi

# Get cluster name from kubectl context
CLUSTER_NAME=$(kubectl config current-context | awk -F'/' '{print $2}')
echo "🏷️  Using cluster name: $CLUSTER_NAME"

# Install NGINX Ingress Controller (same as Azure!)
echo "📦 Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
echo "⏳ Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Install EBS CSI Driver if not already installed
echo "📦 Checking for EBS CSI Driver..."
if ! aws eks describe-addon --cluster-name "$CLUSTER_NAME" --addon-name aws-ebs-csi-driver --region "$AWS_REGION" > /dev/null 2>&1; then
    echo "📥 Installing EBS CSI Driver addon..."
    aws eks create-addon \
        --cluster-name "$CLUSTER_NAME" \
        --addon-name aws-ebs-csi-driver \
        --region "$AWS_REGION" \
        --resolve-conflicts OVERWRITE
    
    echo "⏳ Waiting for EBS CSI Driver to be ready..."
    aws eks wait addon-active \
        --cluster-name "$CLUSTER_NAME" \
        --addon-name aws-ebs-csi-driver \
        --region "$AWS_REGION"
else
    echo "✅ EBS CSI Driver already installed"
fi

# Deploy application resources (same as Azure!)
echo "📋 Deploying application resources..."

kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f pvc.yaml

kubectl apply -f ollama-deployment.yaml
kubectl apply -f sdk-deployment.yaml
kubectl apply -f containerxdr-deployment.yaml
kubectl apply -f aichat-deployment.yaml
kubectl apply -f ui-deployment.yaml

kubectl apply -f ingress-nginx.yaml

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
echo "📝 Next steps:"
echo "1. Wait for NGINX Load Balancer to get external IP (5-10 minutes)"
echo "2. Update your DNS to point to the external IP"
echo "3. Add your API_KEY to secret.yaml:"
echo "   echo -n 'your-api-key' | base64"
echo "4. Update the secret:"
echo "   kubectl apply -f secret.yaml"

echo ""
echo "📍 To get Load Balancer IP:"
echo "kubectl get service -n ingress-nginx ingress-nginx-controller'" 