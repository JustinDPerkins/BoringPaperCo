# Boring Paper Co - AI-Powered Business Platform

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

**Boring Paper Co** is a modern, AI-powered business platform that combines document management, AI chat assistance, and security monitoring into a unified web application. Built with microservices architecture, it's designed to run seamlessly across multiple cloud providers.

## 🎯 What Does Boring Paper Co Do?

### 📄 **Document Management & Processing**
- **File Upload & Storage**: Secure document upload with support for multiple file types
- **AI-Powered Analysis**: Intelligent document processing using local AI models
- **Search & Organization**: Advanced search capabilities across your document library

### 🤖 **AI Chat Assistant**
- **Intelligent Conversations**: Chat with an AI assistant powered by Ollama's phi:latest model
- **Context-Aware Responses**: AI that understands your business context and documents
- **Local AI Processing**: Privacy-focused AI that runs entirely on your infrastructure


## 🏗️ Architecture Overview

Boring Paper Co is built using a **microservices architecture** with 5 core services:

| Service | Purpose | Technology |
|---------|---------|------------|
| **UI** | React frontend with NGINX proxy | React, Vite, NGINX |
| **SDK** | Core business logic and API | Go, Echo framework |
| **ContainerXDR** | Security monitoring & terminal | Go, WebSocket support |
| **AI Chat** | AI conversation interface | Go, Ollama integration |
| **Ollama** | Local AI model inference | Ollama, phi:latest model |

### Key Technical Features

- **Multi-Cloud Ready**: Deploy on AWS EKS, Azure AKS, or Google Cloud GKE
- **Containerized**: Fully containerized with Docker for easy deployment
- **Scalable**: Kubernetes-native design for horizontal scaling
- **Secure**: Built-in security scanning and monitoring
- **AI-First**: Local AI processing for privacy and performance

## 🚀 Getting Started

### Option 1: Local Development (Docker Compose)
```bash
cd local
docker-compose up -d
# Access at http://localhost:3000
```

### Option 2: Cloud Deployment
Choose your preferred cloud provider:

- **[AWS EKS](./aws/)** - Enterprise-grade Kubernetes on AWS
- **[Azure AKS](./azure/)** - Managed Kubernetes on Microsoft Azure  
- **[Google Cloud GKE](./gcp/)** - Google's managed Kubernetes service

Each cloud deployment includes:
- **Infrastructure as Code** with Terraform
- **Automated deployment scripts** for easy setup
- **Production-ready configuration** with load balancing and monitoring

---

### **Infrastructure**
- **Kubernetes** - Container orchestration and management
- **Docker** - Application containerization
- **Terraform** - Infrastructure as Code automation


### **Multi-Cloud Deployment**
- Identical functionality across AWS, Azure, and GCP
- Cloud-native optimizations for each platform
- Consistent user experience regardless of deployment location
- Easy migration between cloud providers

### **Multi-Cloud Context Switching**
```bash
# Ensure Kube Context is correct for the cluster you may be interacting with
kubectl config current-context

# List all available contexts
kubectl config get-contexts

# Switch Kube Contexts
kubectl config use-context <Name to switch to>
```

