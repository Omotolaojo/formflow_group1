#!/usr/bin/env bash
# Exact Azure CLI equivalent of the formflow Terraform configuration
# Usage:
#   1. export SSH_PUBLIC_KEY="$(cat ~/your_public_key.pub)"
#   2. export ADMIN_IP="1.2.3.4"
#   3. export SUBSCRIPTION_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
#   4. ./azure-cli-formflow.sh
# ---------------------------------------------------------------------------

set -euo pipefail

# ---------------------------------------------------------------------------
# Variables (match terraform/variables.tf)
# ---------------------------------------------------------------------------
PREFIX="${PREFIX:-formflow}"
LOCATION="${LOCATION:-uksouth}"
VNET_ADDRESS_SPACE="${VNET_ADDRESS_SPACE:-10.10.0.0/16}"
SUBNET_ADDRESS="${SUBNET_ADDRESS:-10.10.1.0/24}"

: "${SUBSCRIPTION_ID:?Set SUBSCRIPTION_ID}"
: "${SSH_PUBLIC_KEY:?Set SSH_PUBLIC_KEY}"
: "${ADMIN_IP:?Set ADMIN_IP (e.g. 1.2.3.4)}"

RG_NAME="${PREFIX}-rg"
VNET_NAME="${PREFIX}-vnet"
SUBNET_NAME="${PREFIX}-subnet-formflow"
NSG_NAME="${PREFIX}-nsg"
NIC_NAME="${PREFIX}-nic-ff"
PIP_NAME="${PREFIX}-pip"
VM_NAME="${PREFIX}-vm"
ADMIN_USERNAME="azureuser"
VM_SIZE="Standard_D2s_v3"

echo "==> Setting subscription"
az account set --subscription "$SUBSCRIPTION_ID"

# ---------------------------------------------------------------------------
# Resource Group  (main.tf → azurerm_resource_group.rg-formflow)
# ---------------------------------------------------------------------------
echo "==> Creating resource group: $RG_NAME"
az group create \
  --name "$RG_NAME" \
  --location "$LOCATION" \
  --output none

# ---------------------------------------------------------------------------
# Virtual Network  (network.tf → azurerm_virtual_network.vnet-formflow)
# ---------------------------------------------------------------------------
echo "==> Creating virtual network: $VNET_NAME"
az network vnet create \
  --resource-group "$RG_NAME" \
  --name "$VNET_NAME" \
  --location "$LOCATION" \
  --address-prefixes "$VNET_ADDRESS_SPACE" \
  --output none

# ---------------------------------------------------------------------------
# Subnet  (subnet.tf → azurerm_subnet.subnet-formflow)
# ---------------------------------------------------------------------------
echo "==> Creating subnet: $SUBNET_NAME"
az network vnet subnet create \
  --resource-group "$RG_NAME" \
  --vnet-name "$VNET_NAME" \
  --name "$SUBNET_NAME" \
  --address-prefixes "$SUBNET_ADDRESS" \
  --output none

# ---------------------------------------------------------------------------
# Network Security Group  (nsg.tf → azurerm_network_security_group.nsg-formflow)
# ---------------------------------------------------------------------------
echo "==> Creating network security group: $NSG_NAME"
az network nsg create \
  --resource-group "$RG_NAME" \
  --name "$NSG_NAME" \
  --location "$LOCATION" \
  --tags environment=Production \
  --output none

# AllowSSH  (priority 100)
echo "==> Adding NSG rule: AllowSSH"
az network nsg rule create \
  --resource-group "$RG_NAME" \
  --nsg-name "$NSG_NAME" \
  --name AllowSSH \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --source-port-ranges '*' \
  --source-address-prefixes "$ADMIN_IP" \
  --destination-address-prefixes '*' \
  --destination-port-ranges 22 \
  --output none

# AllowHTTP  (priority 110)
echo "==> Adding NSG rule: AllowHTTP"
az network nsg rule create \
  --resource-group "$RG_NAME" \
  --nsg-name "$NSG_NAME" \
  --name AllowHTTP \
  --priority 110 \
  --direction Inbound \
  --access Allow \
  --protocol '*' \
  --source-port-ranges '*' \
  --source-address-prefixes '*' \
  --destination-address-prefixes '*' \
  --destination-port-ranges 80 \
  --output none

# Associate NSG with subnet  (nsg.tf → azurerm_subnet_network_security_group_association)
echo "==> Associating NSG with subnet"
az network vnet subnet update \
  --resource-group "$RG_NAME" \
  --vnet-name "$VNET_NAME" \
  --name "$SUBNET_NAME" \
  --network-security-group "$NSG_NAME" \
  --output none

# ---------------------------------------------------------------------------
# Public IP  (vm.tf → azurerm_public_ip.vm-public-ip)
# ---------------------------------------------------------------------------
echo "==> Creating public IP: $PIP_NAME"
az network public-ip create \
  --resource-group "$RG_NAME" \
  --name "$PIP_NAME" \
  --location "$LOCATION" \
  --sku Standard \
  --allocation-method Static \
  --output none

# ---------------------------------------------------------------------------
# Network Interface  (vm.tf → azurerm_network_interface.nic-ff)
# ---------------------------------------------------------------------------
echo "==> Creating network interface: $NIC_NAME"
az network nic create \
  --resource-group "$RG_NAME" \
  --name "$NIC_NAME" \
  --location "$LOCATION" \
  --vnet-name "$VNET_NAME" \
  --subnet "$SUBNET_NAME" \
  --public-ip-address "$PIP_NAME" \
  --output none

# ---------------------------------------------------------------------------
# Linux Virtual Machine  (vm.tf → azurerm_linux_virtual_machine.vm-formflow)
# ---------------------------------------------------------------------------
echo "==> Creating virtual machine: $VM_NAME"
# Write SSH key to a temp file (az vm create expects a file path)
SSH_KEY_FILE=$(mktemp)
echo "$SSH_PUBLIC_KEY" > "$SSH_KEY_FILE"

az vm create \
  --resource-group "$RG_NAME" \
  --name "$VM_NAME" \
  --location "$LOCATION" \
  --nics "$NIC_NAME" \
  --size "$VM_SIZE" \
  --admin-username "$ADMIN_USERNAME" \
  --authentication-type ssh \
  --ssh-key-values "$SSH_KEY_FILE" \
  --image "Canonical:ubuntu-24_04-lts:server:latest" \
  --os-disk-caching ReadWrite \
  --storage-sku Standard_LRS \
  --output none

rm -f "$SSH_KEY_FILE"

# ---------------------------------------------------------------------------
# Outputs  (outputs.tf)
# ---------------------------------------------------------------------------
echo ""
echo "=============================================="
echo " Deployment complete"
echo "=============================================="

VM_PUBLIC_IP=$(az network public-ip show \
  --resource-group "$RG_NAME" \
  --name "$PIP_NAME" \
  --query ipAddress -o tsv)

VM_PRIVATE_IP=$(az network nic show \
  --resource-group "$RG_NAME" \
  --name "$NIC_NAME" \
  --query "ipConfigurations[0].privateIPAddress" -o tsv)

echo "vm_public_ip  = $VM_PUBLIC_IP"
echo "vm_private_ip = $VM_PRIVATE_IP"
echo ""
echo "SSH: ssh ${ADMIN_USERNAME}@${VM_PUBLIC_IP}"
