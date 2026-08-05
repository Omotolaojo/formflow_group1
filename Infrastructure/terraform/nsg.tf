resource "azurerm_network_security_group" "nsg-formflow" {
  name                = "${var.prefix}-nsg"
  location            = azurerm_resource_group.rg-formflow.location
  resource_group_name = azurerm_resource_group.rg-formflow.name

  security_rule {
    name                       = "AllowHTTP"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
    destination_port_range     = "80"
  }

  security_rule {
    name                       = "AllowSSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
    destination_port_range     = "22"
  }

  tags = {
    environment = "Production"
  }
  depends_on = [azurerm_subnet.subnet-formflow]
}

resource "azurerm_subnet_network_security_group_association" "nsg-formflow-association" {
  subnet_id                 = azurerm_subnet.subnet-formflow.id
  network_security_group_id = azurerm_network_security_group.nsg-formflow.id
}