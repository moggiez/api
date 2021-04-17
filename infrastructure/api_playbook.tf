locals {
  stage = "v1"
}

resource "aws_api_gateway_rest_api" "_" {
  name        = "PlaybookAPI"
  description = "Playbook API Gateway"
}


# PLAYBOOK API
module "playbook_lambda_api" {
  source       = "./modules/lambda_api"
  name         = "Playbook"
  api          = aws_api_gateway_rest_api._
  path_part    = "playbook"
  bucket       = aws_s3_bucket.api_bucket
  dist_version = var.dist_version
  dist_dir     = "../dist"
}

module "playbook_lambda_api_proxy" {
  source              = "./modules/api_resource_proxy"
  api                 = aws_api_gateway_rest_api._
  http_method         = "GET"
  parent_api_resource = module.playbook_lambda_api.api_resource
  lambda              = module.playbook_lambda_api.lambda
}

# Deployment of the API Gateway
resource "aws_api_gateway_deployment" "playbook_api_deployment" {
  depends_on = [module.playbook_lambda_api]

  rest_api_id = aws_api_gateway_rest_api._.id
  stage_name  = local.stage
}
# END PLAYBOOK API

# DOMAIN FOR THE API
module "playbook_api_subdomain_mapping" {
  source         = "./modules/api_subdomain_mapping"
  api            = aws_api_gateway_rest_api._
  api_stage_name = local.stage
  domain_name    = "moggies.io"
  api_name       = "playbook"
}

# END DOMAIN FOR THE API