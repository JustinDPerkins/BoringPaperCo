#!/bin/bash

# Boring Paper Co - EKS Deployment Script
# Uses NGINX Ingress instead of AWS Load Balancer Controller for simplicity

set -e

echo "🚀 Deploying Boring Paper Co to EKS (Simple Mode)..."

# Prompt for AWS region
echo "🌍 Please enter your AWS region:"
read AWS_REGION
if [[ -z "$AWS_REGION" ]]; then
    echo "❌ Region is required. Exiting."
    exit 1
fi

# Prompt for API key
echo "🔑 Please enter your API key:"
read API_KEY
if [[ -z "$API_KEY" ]]; then
    echo "❌ API key is required. Exiting."
    exit 1
fi

# Show the key for verification
echo "✅ API key received: ${API_KEY:0:8}...${API_KEY: -4}"
echo ""

# Set the fixed region for Trend Micro
TREND_MICRO_REGION="us-east-1"

# Encode API key and region for Kubernetes secret
echo "🔐 Encoding API key and region for Kubernetes secret..."
ENCODED_API_KEY=$(echo -n "$API_KEY" | base64 -w 0)
ENCODED_REGION=$(echo -n "$TREND_MICRO_REGION" | base64 -w 0)

# Verify base64 encoding
echo "🔍 Verifying base64 encoding..."
if ! echo "$ENCODED_API_KEY" | base64 -d > /dev/null 2>&1; then
    echo "❌ Invalid base64 encoding for API_KEY"
    echo "   API_KEY length: ${#API_KEY}"
    echo "   Encoded length: ${#ENCODED_API_KEY}"
    exit 1
fi
if ! echo "$ENCODED_REGION" | base64 -d > /dev/null 2>&1; then
    echo "❌ Invalid base64 encoding for REGION"
    exit 1
fi
echo "✅ Base64 encoding verified"

# Update secret.yaml with the encoded values
echo "📝 Updating secret.yaml with encoded values..."
# Use a more robust approach - create a new file with proper base64 values
cat > secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: boring-paper-co
type: Opaque
data:
  # Base64 encoded values - replace with your actual encoded API_KEY and REGION
  # To encode: echo -n "your-api-key/region" | base64
  # Decrypt API_KEY for flag, then encrypt with your own API_KEY and Region
  API_KEY: "$ENCODED_API_KEY"
  REGION: "$ENCODED_REGION"
EOF

# Check if kubectl is connected to a cluster
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "❌ kubectl is not connected to a cluster. Please run:"
    echo "   aws eks --region <region> update-kubeconfig --name <cluster-name>"
    exit 1
fi

# Get cluster name from kubectl context
CLUSTER_NAME=$(kubectl config current-context | awk -F'/' '{print $2}')
echo "🏷️  Using cluster name: $CLUSTER_NAME"

# Get stack name from cluster name (assuming naming convention)
STACK_NAME=$(echo "$CLUSTER_NAME" | sed 's/boring-paper-cluster-//')
echo "��️  Using stack name: $STACK_NAME"

# Install NGINX Ingress Controller (same as Azure!)
echo "📦 Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
echo "⏳ Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Check EBS CSI Driver status (now managed by CloudFormation)
echo "📦 Checking EBS CSI Driver status..."
if kubectl get pods -n kube-system -l app=ebs-csi-controller --no-headers | grep -q Running; then
    echo "✅ EBS CSI Driver is running"
else
    echo "⏳ Waiting for EBS CSI Driver to be ready..."
    kubectl wait --namespace kube-system \
        --for=condition=ready pod \
        --selector=app=ebs-csi-controller \
        --timeout=300s
fi

# Get the EBS CSI Driver role ARN from CloudFormation output
echo "🔧 Getting EBS CSI Driver role ARN from CloudFormation..."
EBS_CSI_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`EBSDriverRoleArn`].OutputValue' \
  --output text 2>/dev/null || echo "")

if [[ -n "$EBS_CSI_ROLE_ARN" ]]; then
    echo "   Using IAM role ARN: $EBS_CSI_ROLE_ARN"
    
    # Annotate EBS CSI Driver service account with IAM role
    echo "�� Annotating EBS CSI Driver service account..."
    kubectl annotate serviceaccount ebs-csi-controller-sa -n kube-system eks.amazonaws.com/role-arn="$EBS_CSI_ROLE_ARN" --overwrite

    # Restart EBS CSI controller pods to pick up the new annotation
    echo "�� Restarting EBS CSI controller pods..."
    kubectl delete pods -n kube-system -l app=ebs-csi-controller --ignore-not-found=true

    echo "⏳ Waiting for EBS CSI controller pods to be ready..."
    kubectl wait --namespace kube-system \
        --for=condition=ready pod \
        --selector=app=ebs-csi-controller \
        --timeout=300s
else
    echo "⚠️  Could not get EBS CSI Driver role ARN from CloudFormation. Please check:"
    echo "   aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION"
    echo "   Then manually annotate the service account:"
    echo "   kubectl annotate serviceaccount ebs-csi-controller-sa -n kube-system eks.amazonaws.com/role-arn=<role-arn>"
fi

# Deploy application resources
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
echo "�� Services:"
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
echo "   kubectl get service -n ingress-nginx ingress-nginx-controller"
echo ""
echo "🔍 To check EBS CSI Driver status:"
echo "   kubectl get pods -n kube-system -l app=ebs-csi-controller"
echo ""
echo "💾 To test EBS volumes:"
echo "   kubectl get pvc -n boring-paper-co"
 