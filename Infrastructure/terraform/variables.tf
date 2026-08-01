variable "prefix" {
  default = "formflow"
}

variable "vnet_address_space" {
  description = "The address space for the virtual network"
  type        = list(string)
  default     = ["10.10.0.0/16"]
}

variable "subnet_address" {
  type    = list(string)
  default = ["10.10.1.0/24"]
}


variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}


variable "ssh_public_key" {
  type      = string
  sensitive = true
}

variable "admin_ip" {
  description = "IP address of the admin machine"
  type        = string
  sensitive   = false
}