resource "azurerm_network_interface" "nic-ff" {
  name                = "${var.prefix}-nic-ff"
  location            = azurerm_resource_group.rg-formflow.location
  resource_group_name = azurerm_resource_group.rg-formflow.name

  ip_configuration {
    name                          = "${var.prefix}-ipconfig1"
    subnet_id                     = azurerm_subnet.subnet-formflow.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.vm-public-ip.id

  }
  depends_on = [azurerm_subnet.subnet-formflow]
}


resource "azurerm_linux_virtual_machine" "vm-formflow" {
  name                  = "${var.prefix}-vm"
  location              = azurerm_resource_group.rg-formflow.location
  resource_group_name   = azurerm_resource_group.rg-formflow.name
  network_interface_ids = [azurerm_network_interface.nic-ff.id]
  size                  = "Standard_D2s_v3"

  admin_username                  = "azureuser"
  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }
}

resource "azurerm_public_ip" "vm-public-ip" {
  name                = "${var.prefix}-pip"
  resource_group_name = azurerm_resource_group.rg-formflow.name
  location            = azurerm_resource_group.rg-formflow.location
  sku                 = "Standard"
  allocation_method   = "Static"
}