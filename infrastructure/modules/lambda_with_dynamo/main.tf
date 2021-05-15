resource "aws_s3_bucket_object" "_" {
  bucket = var.s3_bucket.id
  key    = "${var.name}.${var.dist_version}.zip"
  acl    = "private"
  source = "${var.dist_dir}/${var.name}.${var.dist_version}.zip"
  etag   = filemd5("${var.dist_dir}/${var.name}.${var.dist_version}.zip")
}

resource "aws_lambda_function" "_" {
  function_name = var.name
  s3_bucket     = var.s3_bucket.bucket
  s3_key        = aws_s3_bucket_object._.key

  handler          = "index.handler"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256("${var.dist_dir}/${var.name}.${var.dist_version}.zip")

  layers = var.layers != null ? var.layers : []

  role = aws_iam_role._.arn
}

resource "aws_iam_role" "_" {
  name = "moggiez_${var.name}_execution_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
  managed_policy_arns = var.policies
}