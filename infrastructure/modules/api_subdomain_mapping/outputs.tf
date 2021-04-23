output "api_url" {
  value = "${var.api_subdomain}.${var.domain_name}"
}

output "path_mapping" {
  value = aws_api_gateway_base_path_mapping._
}