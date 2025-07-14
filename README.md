# Boring Paper Co - Multi-Cloud Kubernetes Deployment

[![AWS EKS](https://img.shields.io/badge/AWS%20EKS-Deployed-success?style=for-the-badge&logo=amazon-aws&logoColor=white)](./aws/)
[![Azure AKS](https://img.shields.io/badge/Azure%20AKS-Deployed-success?style=for-the-badge&logo=microsoft-azure&logoColor=white)](./azure/)
[![GCP GKE](https://img.shields.io/badge/GCP%20GKE-Coming%20Soon-yellow?style=for-the-badge&logo=google-cloud&logoColor=white)](#)

[![Terraform](https://img.shields.io/badge/Terraform-Infrastructure-blue?style=flat-square&logo=terraform)](./aws/iac/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-blue?style=flat-square&logo=kubernetes)](./aws/k8s/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=flat-square&logo=docker)](./ui/Dockerfile)
[![NGINX](https://img.shields.io/badge/NGINX-Load%20Balancer-green?style=flat-square&logo=nginx)](./aws/k8s/ingress-nginx.yaml)

<div align="center">
  <img src="ui/public/images/bpclogo.png" alt="Boring Paper Co Logo" width="300">
</div>

A production-ready, multi-cloud microservices application demonstrating **consistent deployment patterns** across AWS EKS, Azure AKS, and Google Cloud GKE.

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
│ ✅ Running  │ ✅ Running  │ 🚧 Planned │
│             │             │             │
│ ECR Registry│ ACR Registry│ GCR Registry│
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
**Status**: ✅ **Production Ready** - All services running, chat API and WebSocket terminal functional

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
**Status**: ✅ **Production Ready** - All services running, recently updated with Terraform ACR

### GCP GKE Deployment  
```bash
# Coming Soon! 🚧
# Following the same proven patterns from AWS/Azure
```
**Status**: 🚧 **Planned** - Will use same NGINX approach for consistency

## 📁 Repository Structure

```
BoringPaperCo/
├── 🌩️  aws/
│   ├── iac/           # Terraform: EKS + ECR + VPC + EBS CSI
│   └── k8s/           # Kubernetes manifests + scripts
├── ☁️  azure/  
│   ├── iac/           # Terraform: AKS + ACR + VNet
│   └── k8s/           # Kubernetes manifests + scripts  
├── 🔧 aichat/         # AI Chat service (Go + Ollama)
├── 🔒 containerxdr/   # Security monitoring (Go + WebSocket)
├── 🖥️  ui/            # React frontend
├── ⚙️  sdk/           # Core API backend (Go)
├── 🧠 ollama/         # LLM inference service
└── 🐳 local/          # Docker Compose for local dev
```

## ⭐ Key Features

### 🎯 **Multi-Cloud Consistency**
- **Same architecture** across AWS, Azure, and GCP
- **NGINX Ingress** instead of cloud-specific load balancers  
- **Terraform automation** for infrastructure
- **Multi-cloud CORS** support in services

### 🔐 **Production-Ready Security**
- WebSocket support for real-time terminal access
- Container registry integration (ECR, ACR)
- Kubernetes network policies and secrets
- HTTPS/TLS ready configurations

### 🤖 **AI-Powered Features**  
- **Ollama integration** with phi:latest model
- **Chat interface** with natural language processing
- **Containerized AI** - fully portable across clouds

### 🛠️ **Developer Experience**
- **One-command deployment** per cloud
- **Terraform automation** - no manual setup
- **Local development** with Docker Compose
- **Comprehensive documentation** with troubleshooting

## 🏆 Migration Success Story

This project demonstrates a **successful migration** from Azure AKS to AWS EKS, learning key lessons:

| Challenge | Solution | Result |
|-----------|----------|---------|
| **Complex AWS ALB** | Simplified with NGINX Ingress | ✅ Works identically on all clouds |
| **EBS Volume Issues** | Added EBS CSI driver IAM role | ✅ Persistent storage working |
| **CORS Errors** | Updated origins for multi-cloud | ✅ Services work across load balancers |
| **WebSocket Failures** | Configured upgrade headers | ✅ Terminal functionality restored |

**Key Insight**: Simple, consistent approaches work better than cloud-specific complexity.

## 🌍 Live Deployments

### AWS EKS Environment
- **Cluster**: `boring-paper-cluster-b7zkmk` (us-west-2)
- **Load Balancer**: `afb9b6963a5144388a094323dfc1a95d-732090510.us-west-2.elb.amazonaws.com`
- **Status**: All services operational, Ollama model loaded
- **Features**: ✅ Chat API, ✅ WebSocket terminal, ✅ File uploads

### Azure AKS Environment  
- **Cluster**: `boring-paper-cluster-ubdi` (eastus)
- **Load Balancer**: `20.242.248.123` (Azure Public IP)
- **Status**: All services operational, stable for 4+ days
- **Features**: ✅ Chat API, ✅ WebSocket terminal, ✅ File uploads

### Multi-Cloud Context Switching
```bash
# Switch between cloud environments
kubectl config use-context arn:aws:eks:us-west-2:975050242527:cluster/boring-paper-cluster-b7zkmk  # AWS
kubectl config use-context boring-paper-cluster-ubdi                                              # Azure  
kubectl config use-context gke_justin-dev-412922_us-central1_boringpaperco-gcp                    # GCP (soon)
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
- **GCP**: GKE, GCR, GCP Disks, VPC, GCP LB *(coming soon)*

## 📋 Prerequisites

- **Cloud CLI**: `aws`, `az`, or `gcloud` configured
- **Container Tools**: Docker Desktop or equivalent
- **Kubernetes**: `kubectl` installed
- **Infrastructure**: Terraform >= 1.0
- **Development**: Go 1.19+, Node.js 18+ (for local development)

## 🚀 Getting Started

1. **Choose your cloud** (AWS or Azure currently supported)
2. **Navigate to cloud directory** (`./aws/` or `./azure/`)  
3. **Follow the README** in that directory for specific instructions
4. **Deploy infrastructure** with Terraform
5. **Build and deploy services** with provided scripts

Each cloud has identical functionality but uses cloud-native services where appropriate.

## 🤝 Contributing

This repository demonstrates **production-ready multi-cloud patterns**. Key areas for contribution:

- **GCP GKE implementation** (following AWS/Azure patterns)
- **Monitoring and observability** across clouds
- **CI/CD pipeline** for multi-cloud deployments  
- **Security enhancements** (network policies, RBAC)
- **Performance optimizations**

## 📈 Roadmap

- [ ] **GCP GKE Deployment** - Complete the multi-cloud trilogy
- [ ] **CI/CD Pipeline** - Automated deployments via GitHub Actions
- [ ] **Monitoring Stack** - Prometheus/Grafana across all clouds
- [ ] **Service Mesh** - Istio for advanced traffic management
- [ ] **GitOps** - ArgoCD for declarative deployments

---

**Built with ❤️ for multi-cloud excellence** | Terraform + Kubernetes + Go + React
