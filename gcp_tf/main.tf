# Provider and Terraform Configuration 

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.55.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "google" {
  region  = var.GCP_REGION
  project = var.PROJECT_ID
  zone    = var.ZONE
}

# Network and Subnet Creation
resource "google_compute_network" "vpc_network" {
  name                    = var.NETWORK_NAME
  auto_create_subnetworks = false
  mtu                     = 1460
}
resource "google_compute_subnetwork" "public-subnetwork" {
  name          = var.SUBNET_NAME
  ip_cidr_range = var.SUBNET_CIDR_RANGE
  region        = var.GCP_REGION
  network       = google_compute_network.vpc_network.name

}

# Reserve Static IP Address
resource "google_compute_address" "static_ip" {
  count = (var.GCP_DOCKERIZED == "yes") ? 1 : (var.GCP_VALIDATOR_COUNT + var.GCP_SENTRY_COUNT + var.GCP_ARCHIVE_COUNT)
  name = format("%s-%s",var.INSTANCE_NAME, count.index)
         
}

# GCP VM Persistant Disk
# resource "google_compute_disk" "node_disk" {
#   count = (var.DOCKERIZED == "yes") ? 1 : (var.VALIDATOR_COUNT + var.SENTRY_COUNT + var.ARCHIVE_COUNT)
#   name = format("%s-%s",var.disk_name, count.index)
#   type = var.disk_type
#   zone = var.zone
#   size = var.disk_size

#   labels = {
#     name = "polygon-matic"
#   }
# }

# GCP Compute VM using Machine Image
resource "google_compute_instance" "node_server" {

  count = (var.GCP_DOCKERIZED == "yes") ? 1 : (var.GCP_VALIDATOR_COUNT + var.GCP_SENTRY_COUNT)

  name         = format("%s-%s",var.INSTANCE_NAME, count.index)
  machine_type = var.MACHINE_TYPE

  boot_disk {
    initialize_params {
      image = var.IMAGE
      size = var.DISK_SIZE
    }
  }

  metadata = {
    ssh-keys = "${join(",", var.USERS)}::${file(var.GCE_SSH_PUB_KEY_FILE)}"
  }

  # attached_disk {
  #   source      = google_compute_disk.node_disk[count.index].id
  #   device_name = google_compute_disk.node_disk[count.index].name
  # }
  network_interface {
    network = google_compute_network.vpc_network.name
    subnetwork = google_compute_subnetwork.public-subnetwork.name

    access_config {
      //IP
      nat_ip = google_compute_address.static_ip[count.index].address
    }
  }
  tags = ["matic-cli"]
  labels = {
    name = "polygon-matic"
  }
}

resource "google_compute_firewall" "matic_rules" {
  name    = var.FW_RULE_NAME
  network = google_compute_network.vpc_network.name

  allow {
    protocol = "tcp"
    ports    = var.PORTS_LIST
  }
  source_ranges = var.GCP_SG_CIDR_BLOCKS
}


# output values
output "public_ip" {
  value = google_compute_address.static_ip.*.address
}

output "instance_ids" {
  value = google_compute_instance.node_server.*.name 
}