resource "azurerm_resource_group" "rg-formflow" {
  name     = "${var.prefix}-rg"
  location = "uksouth"
}
