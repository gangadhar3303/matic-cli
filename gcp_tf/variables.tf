# Global Variables

variable "PROJECT_ID" {
  type = string
  description = "ID of the GCP Project Resource"
  default = "ce-ps-3team"
}

variable "GCP_REGION" {
  type = string
  description = "Region of the GCP Resouce in which it needs to be provisioned"
  default = "us-central1"
}

variable "ZONE" {
  type = string
  description = "Zone of the GCP Resource in hich it needs to be provisioned"
  default = "us-central1-a"
}

# Network and Subnet Creation

variable "NETWORK_NAME" {
  type = string
  description = "Name of the Network in GCP Project"
  default = "google-compute-network"
}

variable "SUBNET_NAME" {
  type = string
  description = "Name of the subnetwork in GCP Project" 
  default = "google-compute-subnetwork" 
}

variable "SUBNET_CIDR_RANGE" {
  type = string
  description = "CIDR range for the Subnetwork"  
  default = "10.0.0.0/16"
}

# variable "STATIC_IP_RANGE" {
#   type = string
#   description = "Name for the Reserved Static IP Address"
#   default = "matic-ip"
# }

# variable "DISK_NAME" {
#   type = string
#   description = "Name for the Compute VM Disk"
#   default = "matic-disk"
# }

variable "DISK_SIZE" {
  type = string
  description = "Size of the Boot Disk for VM"
  default = "100"
}

variable "DISK_TYPE" {
  type = string
  description = "Type of the Compute VM Disk"
  default = "pd-ssd"
}

# Compute Instance Variables

variable "INSTANCE_NAME" {
  type = string
  description = "Name of the Compute VM instance"
  default = "polygon-user"
}

variable "MACHINE_TYPE" {
  type = string
  description = "Type of the Compute VM instance"
  default = "c3-highcpu-22"
}

variable "IMAGE" {
  type = string
  description  = "Name of the VM Image for the Compute VM instance"
  default = "ubuntu-2204-jammy-v20230302"
}

variable "FW_RULE_NAME" {
  type = string
  description = "Name for the GCP firewall ingress rules"
  default = "matic-ingress"
  
}
variable "PORTS_LIST" {
  type = list
  description = "List of all the required port numbers for the matic CLI"
  default = [22, 80, 443, 30303, 1317, 8545, 9545, 1337, 8546, 26656]
}

variable "GCP_DOCKERIZED" {
  default = "no"
}

variable "GCP_VALIDATOR_COUNT" {
  default = "2"
}

variable "GCP_SENTRY_COUNT" {
  default = "1"
}

variable "GCP_ARCHIVE_COUNT" {
  default = "0"
}

variable "USERS" {
  type = list(string)
  default = ["ubuntu"]
}

variable "GCE_SSH_PUB_KEY_FILE" {
  type = string
}

variable "GCP_SG_CIDR_BLOCKS" {
  type = list
}