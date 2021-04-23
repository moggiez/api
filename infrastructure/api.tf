locals {
  stages       = toset(["blue", "green"])
  stage        = "green"
  http_methods = toset(["GET", "POST", "PUT", "DELETE"])
}

resource "aws_api_gateway_rest_api" "_" {
  name        = "MoggiezAPI"
  description = "Moggiez Data API for managing playbooks and customer data"
}


# PLAYBOOK API
module "playbook_lambda_api" {
  source       = "./modules/lambda_api"
  name         = "Playbook"
  api          = aws_api_gateway_rest_api._
  path_part    = "playbook"
  bucket       = aws_s3_bucket.api_bucket
  http_methods = local.http_methods
  dist_version = var.dist_version
  dist_dir     = "../dist"
}

module "playbook_lambda_api_proxy" {
  source              = "./modules/api_resource_proxy"
  api                 = aws_api_gateway_rest_api._
  http_methods        = local.http_methods
  parent_api_resource = module.playbook_lambda_api.api_resource
  lambda              = module.playbook_lambda_api.lambda
}

# Deployment of the API Gateway
resource "aws_api_gateway_deployment" "playbook_api_deployment" {
  for_each = local.stages

  depends_on = [module.playbook_lambda_api]

  rest_api_id = aws_api_gateway_rest_api._.id
  description = each.value

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "paybook_api_stage" {
  for_each = aws_api_gateway_deployment.playbook_api_deployment

  deployment_id = each.value.id
  rest_api_id   = aws_api_gateway_rest_api._.id
  stage_name    = each.value.description

  lifecycle {
    create_before_destroy = true
  }
}
# END PLAYBOOK API

# DOMAIN FOR THE API
module "playbook_api_subdomain_mapping" {
  source         = "./modules/api_subdomain_mapping"
  api            = aws_api_gateway_rest_api._
  api_stage_name = local.stage
  domain_name    = "moggies.io"
  api_subdomain  = "api"
}

# END DOMAIN FOR THE API