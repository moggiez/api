locals {
  stages       = toset(["blue", "green"])
  stage        = "blue"
  http_methods = toset(["GET", "POST", "PUT", "DELETE"])
}

resource "aws_api_gateway_rest_api" "_" {
  name        = "MoggiezAPI"
  description = "Moggiez Data API for managing playbooks and customer data"
}

resource "aws_api_gateway_authorizer" "_" {
  name          = "MoggiesUserAuthorizer"
  rest_api_id   = aws_api_gateway_rest_api._.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = ["arn:aws:cognito-idp:${var.region}:${var.account}:userpool/${var.user_pool_id}"]
}

locals {
  authorizer = local.authorization_enabled ? aws_api_gateway_authorizer._ : null
}

# LOADTEST API
module "loadtest_lambda_api" {
  source         = "git@github.com:moggiez/terraform-modules.git//lambda_api"
  name           = "loadtest"
  api            = aws_api_gateway_rest_api._
  dynamodb_table = "loadtests"
  path_part      = "loadtest"
  bucket         = aws_s3_bucket.api_bucket
  http_methods   = local.http_methods
  dist_dir       = "../dist"
  authorizer     = local.authorizer
  environment    = local.environment
}

module "loadtest_lambda_api_proxy" {
  source              = "git@github.com:moggiez/terraform-modules.git//api_resource_proxy"
  api                 = aws_api_gateway_rest_api._
  http_methods        = local.http_methods
  parent_api_resource = module.loadtest_lambda_api.api_resource
  lambda              = module.loadtest_lambda_api.lambda
  authorizer          = local.authorizer
}

# END LOADTEST API

# ORGANISATION API
module "organisation_lambda_api" {
  source         = "git@github.com:moggiez/terraform-modules.git//lambda_api"
  name           = "organisation"
  api            = aws_api_gateway_rest_api._
  dynamodb_table = "organisations"
  path_part      = "organisation"
  bucket         = aws_s3_bucket.api_bucket
  http_methods   = local.http_methods
  dist_dir       = "../dist"
  authorizer     = local.authorizer
  environment    = local.environment
}

module "organisation_lambda_api_proxy" {
  source              = "git@github.com:moggiez/terraform-modules.git//api_resource_proxy"
  api                 = aws_api_gateway_rest_api._
  http_methods        = local.http_methods
  parent_api_resource = module.organisation_lambda_api.api_resource
  lambda              = module.organisation_lambda_api.lambda
  authorizer          = local.authorizer
}

# END ORGANISATION API

# METRICS API
resource "aws_iam_policy" "cloudwatch_metrics_read_access" {
  name        = "metrics_api-CloudWatchMetricsReadAccess"
  path        = "/"
  description = "IAM policy getting metrics data from CloudWatch."

  policy = templatefile("templates/cloudwatch_metrics_read_access_policy.json", {})
}

module "metrics_lambda_api" {
  source         = "git@github.com:moggiez/terraform-modules.git//lambda_api"
  name           = "metrics"
  api            = aws_api_gateway_rest_api._
  dynamodb_table = "loadtests"
  path_part      = "metrics"
  bucket         = aws_s3_bucket.api_bucket
  http_methods   = ["GET", "POST", "PUT"]
  dist_dir       = "../dist"
  policies = [
    aws_iam_policy.cloudwatch_metrics_read_access.arn,
    aws_iam_policy.dynamodb_access_loadtests.arn,
    aws_iam_policy.dynamodb_access_organisations.arn,
    aws_iam_policy.dynamodb_access_loadtest_metrics.arn
  ]
  authorizer  = local.authorizer
  environment = local.environment
}

module "metrics_lambda_api_proxy" {
  source              = "git@github.com:moggiez/terraform-modules.git//api_resource_proxy"
  api                 = aws_api_gateway_rest_api._
  http_methods        = ["GET", "POST", "PUT"]
  parent_api_resource = module.metrics_lambda_api.api_resource
  lambda              = module.metrics_lambda_api.lambda
  authorizer          = local.authorizer
}

# END METRICS API

# Deployment of the API Gateway
resource "aws_api_gateway_deployment" "api_deployment" {
  for_each = local.stages

  depends_on = [
    module.loadtest_lambda_api,
    module.organisation_lambda_api,
    module.metrics_lambda_api
  ]

  rest_api_id = aws_api_gateway_rest_api._.id
  description = each.value


  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    redeployment = sha1("${timestamp()}")
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  for_each = aws_api_gateway_deployment.api_deployment

  deployment_id = each.value.id
  rest_api_id   = aws_api_gateway_rest_api._.id
  stage_name    = each.value.description

  lifecycle {
    create_before_destroy = true
  }
}
