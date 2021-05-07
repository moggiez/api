resource "aws_api_gateway_resource" "_" {
  path_part   = var.resource_path_part
  parent_id   = var.api.root_resource_id
  rest_api_id = var.api.id
}

resource "aws_api_gateway_method" "_" {
  for_each = var.http_methods

  rest_api_id   = var.api.id
  resource_id   = aws_api_gateway_resource._.id
  http_method   = each.value
  authorization = var.authorizer != null ? "COGNITO_USER_POOLS" : "NONE"
  authorizer_id = var.authorizer != null ? var.authorizer.id : null
}

resource "aws_api_gateway_integration" "_" {
  for_each = aws_api_gateway_method._

  rest_api_id             = var.api.id
  resource_id             = aws_api_gateway_resource._.id
  http_method             = each.value.http_method
  integration_http_method = "POST"

  type = "AWS_PROXY"
  uri  = var.lambda.invoke_arn
}