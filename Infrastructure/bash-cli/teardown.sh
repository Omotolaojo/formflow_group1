#!/usr/bin/env bash
# Teardown script for azure-cli-formflow.sh
# Deletes all resources created by the formflow Azure CLI deployment.
#
# Usage:
#   export SUBSCRIPTION_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
#   ./teardown.sh
#
# Optional:
#   FORCE=1 ./teardown.sh          # skip confirmation prompt
# ===========================================================================

set -euo pipefail

PREFIX="${PREFIX:-formflow}"
LOCATION="${LOCATION:-uksouth}"

: "${SUBSCRIPTION_ID:?Set SUBSCRIPTION_ID}"

RG_NAME="${PREFIX}-rg"
VNET_NAME="${PREFIX}-vnet"
SUBNET_NAME="${PREFIX}-subnet-formflow"
NSG_NAME="${PREFIX}-nsg"
NIC_NAME="${PREFIX}-nic-ff"
PIP_NAME="${PREFIX}-pip"
VM_NAME="${PREFIX}-vm"

echo "==> Setting subscription"
az account set --subscription "$SUBSCRIPTION_ID"

# ---------------------------------------------------------------------------
# Safety check: does the resource group exist?
# ---------------------------------------------------------------------------
if ! az group show --name "$RG_NAME" &>/dev/null; then
  echo "Resource group '$RG_NAME' does not exist. Nothing to tear down."
  exit 0
fi

if [[ "${FORCE:-0}" != "1" ]]; then
  echo ""
  echo "This will DELETE the entire resource group and all resources inside it:"
  echo "  Resource Group : $RG_NAME"
  echo "  Location       : $LOCATION"
  echo "  VM             : $VM_NAME"
  echo "  NIC            : $NIC_NAME"
  echo "  Public IP      : $PIP_NAME"
  echo "  NSG            : $NSG_NAME"
  echo "  Subnet         : $SUBNET_NAME"
  echo "  VNet           : $VNET_NAME"
  echo ""
  read -r -p "Type 'yes' to confirm: " CONFIRM
  if [[ "$CONFIRM" != "yes" ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Fastest & cleanest approach: delete the whole resource group.
# Azure handles dependency ordering automatically.
# ---------------------------------------------------------------------------
echo "==> Deleting resource group: $RG_NAME (this removes everything)"
az group delete \
  --name "$RG_NAME" \
  --yes \
  --no-wait

echo ""
echo "Deletion of resource group '$RG_NAME' has been initiated."
echo "It may take a few minutes to complete."
echo ""
echo "To wait until it is fully gone, run:"
echo "  az group wait --name $RG_NAME --deleted"
echo ""
echo "To check status:"
echo "  az group show --name $RG_NAME 2>/dev/null || echo 'Resource group deleted.'"
