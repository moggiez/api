output "api" {
  value = aws_api_gateway_rest_api._
}

output "api_resource" {
  value = aws_api_gateway_resource._
}

output "integration" {
  value = aws_api_gateway_integration._
}