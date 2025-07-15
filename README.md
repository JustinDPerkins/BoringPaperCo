# Boring Paper Co - Multi-Cloud Kubernetes Deployment

[![AWS EKS](https://img.shields.io/badge/AWS%20EKS-Deployed-success?style=for-the-badge&logo=amazon-aws&logoColor=white)](./aws/)
[![Azure AKS](https://img.shields.io/badge/Azure%20AKS-Deployed-success?style=for-the-badge&logo=microsoft-azure&logoColor=white)](./azure/)
[![GCP GKE](https://img.shields.io/badge/GCP%20GKE-Deployed-success?style=for-the-badge&logo=google-cloud&logoColor=white)](./gcp/)

[![Terraform](https://img.shields.io/badge/Terraform-Infrastructure-blue?style=flat-square&logo=terraform)](./aws/iac/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-blue?style=flat-square&logo=kubernetes)](./aws/k8s/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=flat-square&logo=docker)](./ui/Dockerfile)
[![Go](https://img.shields.io/badge/Go-Backend%20Services-00ADD8?style=flat-square&logo=go&logoColor=white)](./sdk/)
[![NGINX](https://img.shields.io/badge/NGINX-Load%20Balancer-green?style=flat-square&logo=nginx)](./aws/k8s/ingress-nginx.yaml)

<div align="center">
  <img src="ui/public/images/bpclogo.png" alt="Boring Paper Co Logo" width="300">
</div>

A production-ready, multi-cloud microservices application demonstrating **consistent deployment patterns** across AWS EKS, Azure AKS, and Google Cloud GKE. **Complete trilogy** - all three clouds implemented!

## 🏗️ Architecture

The Boring Paper Co application consists of **5 microservices** deployed identically across multiple cloud providers:

| Service | Purpose | Port | Technology |
|---------|---------|------|------------|
| **UI** | React frontend | 80 | React, NGINX |
| **SDK** | Core API backend | 5000 | Go, Echo framework |
| **ContainerXDR** | Security monitoring | 8081 | Go, WebSocket support |
| **AI Chat** | Chat interface | 5001 | Go, Ollama integration |
| **Ollama** | LLM inference | 11434 | Ollama, phi:latest model |

### Multi-Cloud Infrastructure

```
┌─────────────┬─────────────┬─────────────┐
│   AWS EKS   │  Azure AKS  │  GCP GKE   │
├─────────────┼─────────────┼─────────────┤
│ ✅ Running  │ ✅ Running  │ ✅ Running │
│             │             │             │
│ ECR Registry│ ACR Registry│ Artifact Reg│
│ EBS Volumes │ Azure Files │ GCP Disks   │
│ Classic ELB │ Azure LB    │ GCP LB      │
│ VPC + Subnets│ VNet + Subnets│ VPC + Subnets│
└─────────────┴─────────────┴─────────────┘
              │
              ▼
    🌐 NGINX Ingress Controller
       (Consistent across all clouds)
```

## 🚀 Quick Start

### AWS EKS Deployment
```bash
# 1. Infrastructure
cd aws/iac
terraform init && terraform apply

# 2. Build & Deploy  
cd ../k8s
./build-and-push.sh
kubectl apply -f .
```

### Azure AKS Deployment
```bash
# 1. Infrastructure (with new ACR automation)
cd azure/iac
terraform init && terraform apply

# 2. Build & Deploy
cd ../k8s  
./build-and-push.sh
kubectl apply -f .
```

### GCP GKE Deployment  
```bash
# 1. Infrastructure (with Artifact Registry automation)
cd gcp/iac
terraform init && terraform apply

# 2. Build & Deploy
cd ../k8s  
./build-and-push.sh
./deploy.sh
```

## 📁 Repository Structure

```
BoringPaperCo/
├── 🌩️  aws/
│   ├── iac/           # Terraform: EKS + ECR + VPC + EBS CSI
│   └── k8s/           # Kubernetes manifests + scripts
├── ☁️  azure/  
│   ├── iac/           # Terraform: AKS + ACR + VNet
│   └── k8s/           # Kubernetes manifests + scripts  
├── 🔧 gcp/
│   ├── iac/           # Terraform: GKE + Artifact Registry + VPC
│   └── k8s/           # Kubernetes manifests + scripts
├── 🔮 aichat/         # AI Chat service (Go + Ollama)
├── 🔒 containerxdr/   # Security monitoring (Go + WebSocket)
├── 🖥️  ui/            # React frontend
├── ⚙️  sdk/           # Core API backend (Go)
└── 🐳 local/          # Docker Compose for local dev
```

## ⭐ Key Features

### 🎯 **Multi-Cloud Consistency**
- **Same architecture** across AWS, Azure, and GCP
- **NGINX Ingress** instead of cloud-specific load balancers  
- **Terraform automation** for infrastructure
- **Multi-cloud CORS** support in services

### 🤖 **AI-Powered Features**  
- **Ollama integration** with phi:latest model
- **Chat interface** with natural language processing
- **Containerized AI** - fully portable across clouds

### 🏗️ **Cloud-Optimized Deployments**
- **AWS**: Regional EKS with EBS CSI driver
- **Azure**: Regional AKS with Azure Files
- **GCP**: Zonal GKE with optimized e2-standard-4 nodes for cost efficiency

## 🏆 Migration Success Story

This project can demonstrate a **simple migration** from CSP to CSP, learning key lessons:

**Securing Cluster Migrations**: Simple, consistent security implementations.

### Multi-Cloud Context Switching
```bash
# Ensure Kube Context is correct for the cluster you may be interacting with
kubectl config current-context

# List all available contexts
kubectl config get-contexts

# Switch Kube Contexts
kubectl config use-context <Name to switch to>
```

## 🛠️ Technology Stack

**Infrastructure as Code**
- **Terraform** - Multi-cloud infrastructure automation
- **Kubernetes** - Container orchestration (v1.32+)
- **Docker** - Application containerization

**Backend Services**  
- **Go** - High-performance microservices
- **Echo Framework** - HTTP routing and middleware
- **Ollama** - Local LLM inference (phi:latest)

**Frontend**
- **React** - Modern web interface
- **Vite** - Fast build tooling
- **NGINX** - Static file serving and proxy

**Cloud Integration**
- **AWS**: EKS, ECR, EBS CSI, VPC, Classic ELB
- **Azure**: AKS, ACR, Azure Files, VNet, Azure LB  
- **GCP**: GKE, Artifact Registry, GCP Disks, VPC, GCP LB

## 📋 Prerequisites

- **Cloud CLI**: `aws`, `az`, or `gcloud` configured
- **Container Tools**: Docker Desktop or equivalent
- **Kubernetes**: `kubectl` installed
- **Infrastructure**: Terraform >= 1.0
- **Development**: Go 1.19+, Node.js 18+ (for local development)

## 🚀 Getting Started

1. **Choose your cloud** (AWS, Azure, or GCP - all fully supported)
2. **Navigate to cloud directory** (`./aws/`, `./azure/`, or `./gcp/`)  
3. **Follow the README** in that directory for specific instructions
4. **Deploy infrastructure** with Terraform
5. **Build and deploy services** with provided scripts

Each cloud has identical functionality but uses cloud-native services where appropriate.

---

**Built with ❤️ for multi-cloud excellence** | Terraform + Kubernetes + Go + React
