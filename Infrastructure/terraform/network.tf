resource "azurerm_virtual_network" "vnet-formflow" {
  name                = "${var.prefix}-vnet"
  resource_group_name = azurerm_resource_group.rg-formflow.name
  location            = azurerm_resource_group.rg-formflow.location
  address_space       = var.vnet_address_space
}


