# PLAYBOOK API
module "playbook_lambda_api" {
  source       = "./modules/lambda_api"
  name         = "Playbook"
  path_part    = "playbook"
  bucket       = aws_s3_bucket.api_bucket
  dist_version = var.dist_version
  dist_dir     = "../dist"
}

# Deployment of the API Gateway
resource "aws_api_gateway_deployment" "playbook_api_deployment" {
  depends_on = [module.playbook_lambda_api]

  rest_api_id = module.playbook_lambda_api.api
  stage_name  = "v1"
}
# END PLAYBOOK API