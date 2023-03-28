// Below are the variables for the AWS resource provisioning

variable "AWS_PROFILE" {
  type    = string
  default = "default"
}

variable "VM_NAME" {
  type    = string
  default = "polygon-user"
}

variable "DISK_SIZE_GB" {
  default = "100"
}

variable "ARCHIVE_DISK_SIZE_GB" {
  default = "100"
}

variable "IOPS" {
  default = 3000
}

variable "ARCHIVE_IOPS" {
  default = 3000
}

variable "VOLUME_TYPE" {
  default = "gp3"
}

variable "ARCHIVE_VOLUME_TYPE" {
  default = "io1"
}
variable "DOCKERIZED" {
  default = "no"
}

variable "VALIDATOR_COUNT" {
  default = "2"
}

variable "SENTRY_COUNT" {
  default = "1"
}

variable "ARCHIVE_COUNT" {
  default = "0"
}
variable "INSTANCE_TYPE" {
  default = "t2.xlarge"
}

variable "ARCHIVE_INSTANCE_TYPE" {
  default = "t2.xlarge"
}

variable "INSTANCE_AMI" {
  default = "ami-017fecd1353bcc96e"
}

variable "PEM_FILE" {
  default = "aws-key"
}

variable "REGION" {
  default = "us-west-2"
}

variable "SG_CIDR_BLOCKS" {
  description = "Contains allowed IPs. Please, set them into secret.tfvars (example available at secret.tfvars.example)"
  sensitive = true
  default = ["1.2.3.4/0"]
}

variable "SG_CIDR_BLOCKS_OUT" {
  default = ["0.0.0.0/0"]
}

// set ports to be opened in security group for incoming
variable "PORTS_IN" {
  // 22: ssh
  // 80: http
  // 443: https ssl enabled
  // 30303: p2p bor
  // 1317: heimdall
  // 8545: bor https
  // 8546: bor rpc websockets
  // 9545: ganache
  // 1337:
  // 26656: heimdall comms
  default = [22, 80, 443, 30303, 1317, 8545, 9545, 1337, 8546, 26656]
}

// to allow all ports to outside, set to [0]
variable "PORTS_OUT" {
  default = [0]
}


// Below are the resources for GCP resources provisioning

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
  default = "/Users/saikirank/.ssh/ubuntu.pem.pub"
}

variable "GCP_SG_CIDR_BLOCKS" {
  type = list
  default = ["0.0.0.0/0"]
}