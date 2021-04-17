data "aws_route53_zone" "public" {
  private_zone = false
  name         = var.domain_name
}

resource "aws_route53_record" "_" {
  name    = aws_api_gateway_domain_name._.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.public.zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name._.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name._.cloudfront_zone_id
  }
}