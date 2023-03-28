module "aws" {
  source = "./aws_tf"

  AWS_PROFILE           = var.AWS_PROFILE
  VM_NAME               = var.VM_NAME
  DISK_SIZE_GB          = var.DISK_SIZE_GB
  ARCHIVE_DISK_SIZE_GB  = var.ARCHIVE_DISK_SIZE_GB
  IOPS                  = var.IOPS
  ARCHIVE_IOPS          = var.ARCHIVE_IOPS
  VOLUME_TYPE           = var.VOLUME_TYPE
  ARCHIVE_VOLUME_TYPE   = var.ARCHIVE_VOLUME_TYPE
  DOCKERIZED            = var.DOCKERIZED
  VALIDATOR_COUNT       = var.VALIDATOR_COUNT
  SENTRY_COUNT          = var.SENTRY_COUNT
  ARCHIVE_COUNT         = var.ARCHIVE_COUNT
  INSTANCE_TYPE         = var.INSTANCE_TYPE
  ARCHIVE_INSTANCE_TYPE = var.ARCHIVE_INSTANCE_TYPE
  INSTANCE_AMI          = var.INSTANCE_AMI
  PEM_FILE              = var.PEM_FILE
  REGION                = var.REGION
  SG_CIDR_BLOCKS        = var.SG_CIDR_BLOCKS
  SG_CIDR_BLOCKS_OUT    = var.SG_CIDR_BLOCKS_OUT
  PORTS_IN              = var.PORTS_IN
  PORTS_OUT             = var.PORTS_OUT
}

module "gcp" {
  source = "./gcp_tf"

  PROJECT_ID           = var.PROJECT_ID
  GCP_REGION               = var.GCP_REGION
  ZONE                 = var.ZONE
  NETWORK_NAME         = var.NETWORK_NAME
  SUBNET_NAME          = var.SUBNET_NAME
  SUBNET_CIDR_RANGE    = var.SUBNET_CIDR_RANGE
  DISK_SIZE            = var.DISK_SIZE
  DISK_TYPE            = var.DISK_TYPE
  INSTANCE_NAME        = var.INSTANCE_NAME
  MACHINE_TYPE         = var.MACHINE_TYPE
  IMAGE                = var.IMAGE
  FW_RULE_NAME         = var.FW_RULE_NAME
  PORTS_LIST           = var.PORTS_LIST
  GCP_DOCKERIZED           = var.GCP_DOCKERIZED
  GCP_VALIDATOR_COUNT      = var.GCP_VALIDATOR_COUNT
  GCP_SENTRY_COUNT         = var.GCP_SENTRY_COUNT
  GCP_ARCHIVE_COUNT        = var.GCP_ARCHIVE_COUNT
  USERS                = var.USERS
  GCE_SSH_PUB_KEY_FILE = var.GCE_SSH_PUB_KEY_FILE
  GCP_SG_CIDR_BLOCKS       = var.GCP_SG_CIDR_BLOCKS

}

