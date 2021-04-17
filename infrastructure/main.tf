terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket         = "moggiez-api-terraform-state-backend"
    key            = "terraform.state"
    region         = "eu-west-1"
    dynamodb_table = "moggiez-api-terraform_state"
  }
}

provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}

resource "aws_s3_bucket" "api_bucket" {
  bucket = "moggiez-api-lambdas"
  acl    = "private"

  tags = {
    Project = var.application
  }
}

resource "aws_s3_bucket_public_access_block" "bucket_block_public_access" {
  bucket = aws_s3_bucket.api_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# this doesn't work yet, don't know why
locals {
  tags = {
    Project = var.application
  }
}
