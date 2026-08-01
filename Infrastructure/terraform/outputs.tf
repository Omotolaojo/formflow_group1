output "vm_public_ip" {
  description = "Public IP address of the app VM"
  value       = azurerm_public_ip.vm-public-ip.ip_address
}

output "vm_private_ip" {
  description = "Private IP address of the app VM"
  value       = azurerm_network_interface.nic-ff.private_ip_address
}