resource "azurerm_subnet" "subnet-formflow" {
  name                 = "${var.prefix}-subnet-formflow"
  resource_group_name  = azurerm_resource_group.rg-formflow.name
  virtual_network_name = azurerm_virtual_network.vnet-formflow.name
  address_prefixes     = var.subnet_address
  
}