resource "aws_api_gateway_rest_api" "_" {
  name        = var.name
  description = "${var.name} API Gateway"
}

resource "aws_api_gateway_resource" "_" {
  path_part   = var.resource_path_part
  parent_id   = aws_api_gateway_rest_api._.root_resource_id
  rest_api_id = aws_api_gateway_rest_api._.id
}

resource "aws_api_gateway_method" "_" {
  rest_api_id   = aws_api_gateway_rest_api._.id
  resource_id   = aws_api_gateway_resource._.id
  http_method   = var.http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "_" {
  rest_api_id             = aws_api_gateway_rest_api._.id
  resource_id             = aws_api_gateway_resource._.id
  http_method             = aws_api_gateway_method._.http_method
  integration_http_method = "POST"

  type = "AWS_PROXY"
  uri  = var.lambda.invoke_arn
}