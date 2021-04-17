output "api_resource" {
  value = module.gateway_to_lambda.api_resource
}

output "lambda" {
  value = module.lambda_for_api.lambda
}