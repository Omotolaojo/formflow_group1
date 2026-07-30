#!/usr/bin/env bash
set -Eeuo pipefail

# One-time bootstrap for the Terraform remote state account and GitHub OIDC.
# Run after: az login

GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-Omotolaojo/formflow_group1}"
GITHUB_ENVIRONMENT="${GITHUB_ENVIRONMENT:-production}"
PROJECT_NAME="${PROJECT_NAME:-formflow}"
AZURE_LOCATION="${AZURE_LOCATION:-uksouth}"
TF_STATE_RESOURCE_GROUP="${TF_STATE_RESOURCE_GROUP:-rg-${PROJECT_NAME}-tfstate}"
TF_STATE_CONTAINER="${TF_STATE_CONTAINER:-tfstate}"
TF_STATE_KEY="${TF_STATE_KEY:-${PROJECT_NAME}-prod.tfstate}"

SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID:-$(az account show --query id -o tsv)}"
TENANT_ID="$(az account show --query tenantId -o tsv)"
SUFFIX="$(openssl rand -hex 3)"
TF_STATE_STORAGE_ACCOUNT="${TF_STATE_STORAGE_ACCOUNT:-st${PROJECT_NAME//-/}${SUFFIX}}"
APP_DISPLAY_NAME="github-${PROJECT_NAME}-deployment"

az account set --subscription "$SUBSCRIPTION_ID"
az group create --name "$TF_STATE_RESOURCE_GROUP" --location "$AZURE_LOCATION" --output none
az storage account create \
  --name "$TF_STATE_STORAGE_ACCOUNT" \
  --resource-group "$TF_STATE_RESOURCE_GROUP" \
  --location "$AZURE_LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --output none

STORAGE_ID="$(az storage account show --name "$TF_STATE_STORAGE_ACCOUNT" --resource-group "$TF_STATE_RESOURCE_GROUP" --query id -o tsv)"

APP_ID="$(az ad app list --display-name "$APP_DISPLAY_NAME" --query '[0].appId' -o tsv)"
if [[ -z "$APP_ID" ]]; then
  APP_ID="$(az ad app create --display-name "$APP_DISPLAY_NAME" --query appId -o tsv)"
fi
APP_OBJECT_ID="$(az ad app show --id "$APP_ID" --query id -o tsv)"

if ! az ad sp show --id "$APP_ID" >/dev/null 2>&1; then
  az ad sp create --id "$APP_ID" --output none
fi
SP_OBJECT_ID="$(az ad sp show --id "$APP_ID" --query id -o tsv)"

SUBSCRIPTION_SCOPE="/subscriptions/${SUBSCRIPTION_ID}"
az role assignment create \
  --assignee-object-id "$SP_OBJECT_ID" \
  --assignee-principal-type ServicePrincipal \
  --role Contributor \
  --scope "$SUBSCRIPTION_SCOPE" \
  --output none 2>/dev/null || true

az role assignment create \
  --assignee-object-id "$SP_OBJECT_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "$STORAGE_ID" \
  --output none 2>/dev/null || true

CURRENT_USER_OBJECT_ID="$(az ad signed-in-user show --query id -o tsv 2>/dev/null || true)"
if [[ -n "$CURRENT_USER_OBJECT_ID" ]]; then
  az role assignment create \
    --assignee-object-id "$CURRENT_USER_OBJECT_ID" \
    --assignee-principal-type User \
    --role "Storage Blob Data Contributor" \
    --scope "$STORAGE_ID" \
    --output none 2>/dev/null || true
fi

# Create the state container with a short-lived key kept only in this process.
# The GitHub workflow itself uses Entra ID/OIDC and never stores this key.
STATE_ACCOUNT_KEY="$(az storage account keys list \
  --resource-group "$TF_STATE_RESOURCE_GROUP" \
  --account-name "$TF_STATE_STORAGE_ACCOUNT" \
  --query '[0].value' -o tsv)"
az storage container create \
  --name "$TF_STATE_CONTAINER" \
  --account-name "$TF_STATE_STORAGE_ACCOUNT" \
  --account-key "$STATE_ACCOUNT_KEY" \
  --output none
unset STATE_ACCOUNT_KEY
az storage account update \
  --name "$TF_STATE_STORAGE_ACCOUNT" \
  --resource-group "$TF_STATE_RESOURCE_GROUP" \
  --allow-shared-key-access false \
  --output none

FEDERATED_NAME="github-${GITHUB_ENVIRONMENT}"
if ! az ad app federated-credential list --id "$APP_OBJECT_ID" --query "[?name=='${FEDERATED_NAME}'] | [0].name" -o tsv | grep -q .; then
  FEDERATED_FILE="$(mktemp)"
  trap 'rm -f "$FEDERATED_FILE"' EXIT
  cat > "$FEDERATED_FILE" <<JSON
{
  "name": "${FEDERATED_NAME}",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:${GITHUB_REPOSITORY}:environment:${GITHUB_ENVIRONMENT}",
  "description": "GitHub Actions ${GITHUB_ENVIRONMENT} deployment",
  "audiences": ["api://AzureADTokenExchange"]
}
JSON
  az ad app federated-credential create --id "$APP_OBJECT_ID" --parameters "$FEDERATED_FILE" --output none
fi

cat <<OUTPUT

Add these GitHub Environment secrets to '${GITHUB_ENVIRONMENT}':
  AZURE_CLIENT_ID=$APP_ID
  AZURE_TENANT_ID=$TENANT_ID
  AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID

Add these GitHub Environment variables:
  TF_STATE_RESOURCE_GROUP=$TF_STATE_RESOURCE_GROUP
  TF_STATE_STORAGE_ACCOUNT=$TF_STATE_STORAGE_ACCOUNT
  TF_STATE_CONTAINER=$TF_STATE_CONTAINER
  TF_STATE_KEY=$TF_STATE_KEY
  AZURE_LOCATION=$AZURE_LOCATION
  PROJECT_NAME=$PROJECT_NAME
  VM_USERNAME=formflowadmin
  VM_SIZE=Standard_B2s

AZURE_CLIENT_SECRET is deliberately not created. GitHub authenticates through OIDC.
OUTPUT
