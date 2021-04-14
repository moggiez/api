resource "aws_iam_policy" "dynamodb_access_policy" {
  name = "${var.name}_api_lambda_access_dynamodb_policy"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "playbooks" })
}

module "lambda_for_api" {
  source         = "../lambda_with_dynamo"
  s3_bucket      = var.bucket
  dist_dir       = var.dist_dir
  dist_version   = var.dist_version
  name           = "playbook_api"
  dynamodb_table = "playbooks"
  policies       = [aws_iam_policy.dynamodb_access_policy.arn]
}

module "gateway_to_lambda" {
  source             = "../lambda_gateway"
  name               = "${var.name}_API"
  lambda             = module.lambda_for_api.lambda
  http_method        = "GET"
  resource_path_part = var.path_part
}

module "gateway_cors" {
  source          = "../api_gateway_enable_cors"
  api_id          = module.gateway_to_lambda.api.id
  api_resource_id = module.gateway_to_lambda.api_resource.id
}

resource "aws_lambda_permission" "_" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_for_api.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.gateway_to_lambda.api.execution_arn}/*/*"
}