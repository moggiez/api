resource "aws_api_gateway_resource" "_" {
  path_part   = "{proxy+}"
  parent_id   = var.parent_api_resource.id
  rest_api_id = var.api.id
}

resource "aws_api_gateway_method" "_" {
  rest_api_id   = var.api.id
  resource_id   = aws_api_gateway_resource._.id
  http_method   = var.http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "_" {
  rest_api_id             = var.api.id
  resource_id             = aws_api_gateway_resource._.id
  http_method             = aws_api_gateway_method._.http_method
  integration_http_method = "POST"

  type = "AWS_PROXY"
  uri  = var.lambda.invoke_arn
}