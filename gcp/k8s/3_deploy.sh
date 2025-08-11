#!/bin/bash

# Boring Paper Co - GKE Deployment Script

set -e

echo "🚀 Deploying Boring Paper Co to GKE..."

# Check if kubectl is connected to a cluster
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "❌ kubectl is not connected to a cluster. Please run:"
    echo "   gcloud container clusters get-credentials <cluster-name> --region <region> --project <project-id>"
    exit 1
fi

# Install NGINX Ingress Controller if not already installed
echo "📦 Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
echo "⏳ Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Update image references to use Terraform-created Artifact Registry
echo "🔄 Updating image references..."
./2_update-image-refs.sh

# Deploy application resources
echo "📋 Deploying application resources..."

# Apply in order due to dependencies
kubectl apply -f namespace.yaml
kubectl apply -f secret.yaml
kubectl apply -f pvc.yaml

# Deploy ingress first to get load balancer IP
kubectl apply -f ingress.yaml

# Wait for load balancer IP to be assigned
echo "⏳ Waiting for load balancer IP..."
LOAD_BALANCER_IP=""
for i in {1..30}; do
    LOAD_BALANCER_IP=$(kubectl get service -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$LOAD_BALANCER_IP" ] && [ "$LOAD_BALANCER_IP" != "null" ]; then
        echo "✅ Load balancer IP: $LOAD_BALANCER_IP"
        break
    fi
    echo "⏳ Waiting... ($i/30)"
    sleep 10
done

if [ -z "$LOAD_BALANCER_IP" ]; then
    echo "❌ Failed to get load balancer IP, continuing without it..."
    LOAD_BALANCER_IP=""
fi

# Create configmap with dynamic load balancer IP
echo "📝 Creating configmap with load balancer IP: $LOAD_BALANCER_IP"
cat > configmap-temp.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: boring-paper-co
data:
  ENVIRONMENT: "production"
  REGION: "us-central1"
  PLATFORM: "gcp"
  CLOUD_PROVIDER: "google"
  OLLAMA_HOST: "0.0.0.0"
  OLLAMA_ORIGINS: "*"
  OLLAMA_URL: "http://ollama-service:11434"
  VITE_API_BASE_URL: "/api/sdk"
  VITE_OLLAMA_URL: "/api/ollama"
  VITE_AICHAT_URL: "/api/chat"
  VITE_XDR_WS_URL: "/api/xdr/terminal"
  # Multi-cloud CORS support - GCP patterns
  ALLOWED_ORIGINS: "http://boringpapercompany.com,http://azure.boringpapercompany.com,http://gcp.boringpapercompany.com"
  # GCP Load Balancer IP for precise CORS (dynamically set)
  LOAD_BALANCER_IP: "$LOAD_BALANCER_IP"
EOF

kubectl apply -f configmap-temp.yaml
rm -f configmap-temp.yaml

# Deploy services
kubectl apply -f ollama-deployment.yaml
kubectl apply -f sdk-deployment.yaml
kubectl apply -f containerxdr-deployment.yaml  
kubectl apply -f aichat-deployment.yaml
kubectl apply -f ui-deployment.yaml

# Update configmap with actual load balancer IP and restart deployments
if [ -n "$LOAD_BALANCER_IP" ]; then
    echo "🔄 Updating configmap with load balancer IP: $LOAD_BALANCER_IP"
    kubectl patch configmap app-config -n boring-paper-co --patch="{\"data\":{\"LOAD_BALANCER_IP\":\"$LOAD_BALANCER_IP\"}}"
    
    echo "🔄 Restarting deployments to pick up new configmap..."
    kubectl rollout restart deployment/containerxdr -n boring-paper-co
    kubectl rollout restart deployment/aichat -n boring-paper-co
    kubectl rollout restart deployment/sdk -n boring-paper-co
    
    echo "⏳ Waiting for deployments to complete..."
    kubectl rollout status deployment/containerxdr -n boring-paper-co
    kubectl rollout status deployment/aichat -n boring-paper-co
    kubectl rollout status deployment/sdk -n boring-paper-co
fi

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
echo "🌟 Deployment Complete!"
echo ""

# Get ingress IP
INGRESS_IP=$(kubectl get service -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

# GCP Load Balancer (no custom DNS label like Azure)
GCP_LB_URL="http://$INGRESS_IP"

echo "🔗 Access your application:"
echo "   📍 GCP Load Balancer: $GCP_LB_URL/"
echo ""
echo "🖥️  Terminal: ws://$INGRESS_IP/api/xdr/terminal"
echo "🤖 Chat API: http://$INGRESS_IP/api/chat"
echo "📚 SDK API:  http://$INGRESS_IP/api/sdk"
echo "🧠 Ollama API: http://$INGRESS_IP/api/ollama"
echo ""
echo "✨ Multi-cloud CORS and GKE Standard cluster working!"
echo ""
echo "📝 Next steps:"
echo "1. Configure custom domain (optional) for prettier URLs"
echo "2. Set up SSL/TLS certificates with cert-manager" 
echo "3. Test all service endpoints" 