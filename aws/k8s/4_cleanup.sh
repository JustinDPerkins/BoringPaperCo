#!/bin/bash

# Boring Paper Co - Cleanup Script
# Removes all resources deployed by 3_deploy.sh

set -e

echo "🧹 Cleaning up Boring Paper Co deployment..."

# Prompt for AWS region
echo "🌍 Please enter your AWS region:"
read AWS_REGION
if [[ -z "$AWS_REGION" ]]; then
    echo "❌ Region is required. Exiting."
    exit 1
fi

# Get cluster name from kubectl context
if kubectl cluster-info > /dev/null 2>&1; then
    CLUSTER_NAME=$(kubectl config current-context | awk -F'/' '{print $2}')
    echo "🏷️  Using cluster name: $CLUSTER_NAME"
else
    echo "⚠️  kubectl not connected to cluster, skipping cluster-specific cleanup"
    CLUSTER_NAME=""
fi

# Remove application namespace (this will delete all resources in the namespace)
echo "🗑️  Removing application namespace and all resources..."
kubectl delete namespace boring-paper-co --ignore-not-found=true

# Wait for namespace to be fully deleted
echo "⏳ Waiting for namespace deletion to complete..."
while kubectl get namespace boring-paper-co > /dev/null 2>&1; do
    echo "   Still deleting namespace..."
    sleep 5
done

# Remove AWS Load Balancer Controller completely
echo "🗑️  Removing AWS Load Balancer Controller..."
helm uninstall aws-load-balancer-controller -n kube-system || true
kubectl delete deployment aws-load-balancer-controller -n kube-system --ignore-not-found=true
kubectl delete serviceaccount aws-load-balancer-controller -n kube-system --ignore-not-found=true
kubectl delete clusterrole aws-load-balancer-controller-role --ignore-not-found=true
kubectl delete clusterrolebinding aws-load-balancer-controller-rolebinding --ignore-not-found=true
kubectl delete role aws-load-balancer-controller-leader-election-role -n kube-system --ignore-not-found=true
kubectl delete rolebinding aws-load-balancer-controller-leader-election-rolebinding -n kube-system --ignore-not-found=true
kubectl delete service aws-load-balancer-webhook-service -n kube-system --ignore-not-found=true
kubectl delete secret aws-load-balancer-tls -n kube-system --ignore-not-found=true
kubectl delete mutatingwebhookconfiguration aws-load-balancer-webhook --ignore-not-found=true
kubectl delete validatingwebhookconfiguration aws-load-balancer-webhook --ignore-not-found=true
kubectl delete ingressclass alb --ignore-not-found=true

# Remove all ALB controller CRDs
echo "🗑️  Removing AWS Load Balancer Controller CRDs..."
kubectl delete crd targetgroupbindings.elbv2.k8s.aws --ignore-not-found=true
kubectl delete crd ingressclassparams.elbv2.k8s.aws --ignore-not-found=true

# Remove EBS CSI Driver addon
if [[ -n "$CLUSTER_NAME" ]]; then
    echo "🗑️  Removing EBS CSI Driver addon..."
    aws eks delete-addon --cluster-name "$CLUSTER_NAME" --addon-name aws-ebs-csi-driver --region "$AWS_REGION" --no-preserve 2>/dev/null || echo "   EBS CSI driver not found or already removed"
    
    # Wait for addon removal
    echo "⏳ Waiting for EBS CSI driver removal..."
    while aws eks describe-addon --cluster-name "$CLUSTER_NAME" --addon-name aws-ebs-csi-driver --region "$AWS_REGION" > /dev/null 2>&1; do
        echo "   Still removing EBS CSI driver..."
        sleep 10
    done
fi

# Remove cert-manager completely
echo "🗑️  Removing cert-manager..."
kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/v1.13.2/cert-manager.yaml --ignore-not-found=true || true

# Wait for cert-manager namespace to be deleted
echo "⏳ Waiting for cert-manager cleanup..."
while kubectl get namespace cert-manager > /dev/null 2>&1; do
    echo "   Still deleting cert-manager..."
    sleep 5
done

# Remove any orphaned persistent volumes
echo "🗑️  Checking for orphaned persistent volumes..."
kubectl get pv | grep boring-paper-co || echo "   No orphaned PVs found"

# Remove any orphaned load balancers (show them for manual cleanup if needed)
echo "🗑️  Checking for orphaned load balancers..."
if command -v aws >/dev/null 2>&1; then
    echo "   ALBs with boring-paper tags:"
    aws elbv2 describe-load-balancers --region "$AWS_REGION" --query 'LoadBalancers[?contains(LoadBalancerName, `k8s-boringpa`) || contains(LoadBalancerName, `k8s-default`)].{Name:LoadBalancerName,DNS:DNSName}' --output table 2>/dev/null || echo "   No ALBs found"
fi

# Clean up helm repos (optional - keeps charts updated)
echo "🗑️  Cleaning up helm repository cache..."
helm repo remove eks 2>/dev/null || echo "   EKS helm repo not found"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "🔍 Verification - checking for remaining resources:"
echo ""
echo "Namespaces:"
kubectl get ns | grep -E "(boring-paper|cert-manager)" || echo "✅ No boring-paper or cert-manager namespaces found"
echo ""
echo "Load Balancer Controller:"
kubectl get deployment -n kube-system aws-load-balancer-controller 2>/dev/null || echo "✅ No ALB controller found"
echo ""
echo "EBS CSI Driver:"
if [[ -n "$CLUSTER_NAME" ]]; then
    aws eks describe-addon --cluster-name "$CLUSTER_NAME" --addon-name aws-ebs-csi-driver --region "$AWS_REGION" 2>/dev/null || echo "✅ No EBS CSI driver addon found"
fi
echo ""
echo "🎉 Ready for fresh deployment!"
echo ""
echo "💡 Next steps:"
echo "   ./3_deploy.sh    # Deploy everything fresh" 