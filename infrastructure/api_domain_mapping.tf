module "playbook_api_subdomain_mapping" {
  source          = "git@github.com:moggiez/terraform-modules.git//api_subdomain_mapping"
  api             = aws_api_gateway_rest_api._
  api_stage_name  = local.stage
  api_subdomain   = "api"
  certificate_arn = aws_acm_certificate._.arn
  domain_name     = "moggies.io"
  hosted_zone_id  = local.hosted_zone.zone_id
}