#!/bin/bash

# Boring Paper Co - Update Image References in Deployment Files
# Automatically detects current AWS context and updates all references

set -e

echo "🔍 Detecting current AWS context..."

# Get current AWS context
CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
echo "🌍 Please enter your AWS region:"
read CURRENT_REGION
if [[ -z "$CURRENT_REGION" ]]; then
    echo "❌ Region is required. Exiting."
    exit 1
fi
CURRENT_CLUSTER=$(kubectl config current-context 2>/dev/null | awk -F'/' '{print $2}' || echo "")

if [[ -z "$CURRENT_ACCOUNT" ]]; then
    echo "❌ Error: Could not determine current AWS account"
    echo "   Please ensure you have valid AWS credentials configured"
    exit 1
fi

echo "✅ Current context detected:"
echo "   🔢 Account ID: $CURRENT_ACCOUNT"
echo "   📍 Region: $CURRENT_REGION"
echo "   🏷️  Cluster: $CURRENT_CLUSTER"
echo ""

# Function to find and replace ECR URLs in a file
update_ecr_urls() {
    local file="$1"
    local old_account="$2"
    local new_account="$3"
    local old_region="$4"
    local new_region="$5"
    
    if [[ ! -f "$file" ]]; then
        return 1
    fi
    
    echo "📝 Updating $file..."
    
    # No backups: modify files in-place
    
    # Replace account ID and region in ECR URLs
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/${old_account}\.dkr\.ecr\.${old_region}\.amazonaws\.com/${new_account}.dkr.ecr.${new_region}.amazonaws.com/g" "$file"
    else
        # Linux
        sed -i "s/${old_account}\.dkr\.ecr\.${old_region}\.amazonaws\.com/${new_account}.dkr.ecr.${new_region}.amazonaws.com/g" "$file"
    fi
    
    # Also replace any standalone account IDs or regions
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/${old_account}/${new_account}/g" "$file"
        sed -i '' "s/${old_region}/${new_region}/g" "$file"
    else
        # Linux
        sed -i "s/${old_account}/${new_account}/g" "$file"
        sed -i "s/${old_region}/${new_region}/g" "$file"
    fi
    
    echo "   ✅ Updated: $old_account.dkr.ecr.$old_region.amazonaws.com → $new_account.dkr.ecr.$new_region.amazonaws.com"
}

# Function to detect old values from existing files
detect_old_values() {
    local old_account=""
    local old_region=""
    
    # Look for existing ECR URLs in deployment files
    for service in "ui" "sdk" "containerxdr" "aichat"; do
        if [[ -f "${service}-deployment.yaml" ]]; then
            # Extract account ID and region from existing ECR URL
            local ecr_url=$(grep -o '[0-9]\{12\}\.dkr\.ecr\.[a-z0-9-]\+\.[a-z0-9-]\+\.amazonaws\.com' "${service}-deployment.yaml" | head -1)
            if [[ -n "$ecr_url" ]]; then
                old_account=$(echo "$ecr_url" | cut -d'.' -f1)
                old_region=$(echo "$ecr_url" | cut -d'.' -f4)
                echo "🔍 Detected existing ECR URL pattern: $old_account.dkr.ecr.$old_region.amazonaws.com"
                break
            fi
        fi
    done
    
    # If no pattern found, use defaults
    if [[ -z "$old_account" ]]; then
        old_account="975050242527"
        old_region="us-east-1"
        echo "⚠️  No existing ECR pattern found, using defaults: $old_account.dkr.ecr.$old_region.amazonaws.com"
    fi
    
    # Return values as separate lines to avoid parsing issues
    echo "$old_account"
    echo "$old_region"
}

echo "🔄 Updating image references in deployment files..."

# Detect old values
echo "🔍 Detecting existing ECR patterns..."
old_values=($(detect_old_values))
old_account="${old_values[0]}"
old_region="${old_values[1]}"

# Validate detected values
if [[ ! "$old_account" =~ ^[0-9]{12}$ ]]; then
    echo "❌ Error: Invalid account ID detected: $old_account"
    echo "   Using fallback values..."
    old_account="975050242527"
    old_region="us-east-1"
fi

if [[ ! "$old_region" =~ ^[a-z0-9-]+$ ]]; then
    echo "❌ Error: Invalid region detected: $old_region"
    echo "   Using fallback values..."
    old_account="975050242527"
    old_region="us-east-1"
fi

echo "📊 Detected values:"
echo "   Old account: $old_account"
echo "   Old region: $old_region"
echo ""

# Update deployment files
services=("ui" "sdk" "containerxdr" "aichat")
updated_files=()

for service in "${services[@]}"; do
    if update_ecr_urls "${service}-deployment.yaml" "$old_account" "$CURRENT_ACCOUNT" "$old_region" "$CURRENT_REGION"; then
        updated_files+=("${service}-deployment.yaml")
    fi
done

# Update ingress files
if [[ -f "ingress-nginx.yaml" ]]; then
    if update_ecr_urls "ingress-nginx.yaml" "$old_account" "$CURRENT_ACCOUNT" "$old_region" "$CURRENT_REGION"; then
        updated_files+=("ingress-nginx.yaml")
    fi
elif [[ -f "ingress.yaml" ]]; then
    if update_ecr_urls "ingress.yaml" "$old_account" "$CURRENT_ACCOUNT" "$old_region" "$CURRENT_REGION"; then
        updated_files+=("ingress.yaml")
    fi
fi

# Update other potential files
other_files=("namespace.yaml" "configmap.yaml" "secret.yaml" "pvc.yaml")
for file in "${other_files[@]}"; do
    if [[ -f "$file" ]]; then
        if update_ecr_urls "$file" "$old_account" "$CURRENT_ACCOUNT" "$old_region" "$CURRENT_REGION"; then
            updated_files+=("$file")
        fi
    fi
done

echo ""
echo "🎉 Update complete!"
echo ""
echo "📋 Files updated:"
for file in "${updated_files[@]}"; do
    echo "  ✓ $file"
done

echo ""
echo "📊 Summary:"
echo "   Old context: $old_account.dkr.ecr.$old_region.amazonaws.com"
echo "   New context: $CURRENT_ACCOUNT.dkr.ecr.$CURRENT_REGION.amazonaws.com"
echo "   Cluster: $CURRENT_CLUSTER"
echo "🚀 Next step: Run 3_deploy.sh to deploy to EKS" 