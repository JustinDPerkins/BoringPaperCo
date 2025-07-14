# Generate random suffix for resource group name
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_resource_group" "rg" {
  location = var.resource_group_location
  name     = "${var.resource_group_name_prefix}-boring-paper-${random_string.suffix.result}"
}

resource "random_string" "cluster_suffix" {
  length  = 4
  special = false
  upper   = false
}

resource "azurerm_kubernetes_cluster" "k8s" {
  location            = azurerm_resource_group.rg.location
  name                = "boring-paper-cluster-${random_string.cluster_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "boring-paper-dns-${random_string.cluster_suffix.result}"

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = var.node_count
  }
  linux_profile {
    admin_username = var.username

    ssh_key {
      key_data = azapi_resource_action.ssh_public_key_gen.output.publicKey
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
}

# Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "boringpaperco${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = var.environment
    Project     = "BoringPaperCo"
    ManagedBy   = "Terraform"
  }
}

# Role assignment to allow AKS to pull from ACR
resource "azurerm_role_assignment" "acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.k8s.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}