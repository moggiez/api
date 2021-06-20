terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket         = "moggies.io-terraform-state-backend"
    key            = "api-terraform.state"
    region         = "eu-west-1"
    dynamodb_table = "moggies.io-api-terraform_state"
  }
}

provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}

data "aws_route53_zone" "public" {
  private_zone = false
  name         = var.domain_name
}

locals {
  hosted_zone           = data.aws_route53_zone.public
  authorization_enabled = true
  environment           = "PROD"
}