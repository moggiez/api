terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}

resource "aws_api_gateway_domain_name" "_" {
  certificate_arn = aws_acm_certificate_validation._.certificate_arn
  domain_name     = "${var.api_subdomain}.${var.domain_name}"
  security_policy = "TLS_1_2"
}

resource "aws_api_gateway_base_path_mapping" "_" {
  api_id      = var.api.id
  stage_name  = var.api_stage_name
  domain_name = aws_api_gateway_domain_name._.domain_name
}