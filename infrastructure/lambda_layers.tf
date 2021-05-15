resource "aws_lambda_layer_version" "db" {
  filename         = "../dist/db_layer.zip"
  source_code_hash = filebase64sha256("../dist/db_layer.zip")
  layer_name       = "moggies_layer_db"

  compatible_runtimes = ["nodejs14.x"]
}

resource "aws_lambda_layer_version" "auth" {
  filename         = "../dist/auth_layer.zip"
  source_code_hash = filebase64sha256("../dist/auth_layer.zip")
  layer_name       = "moggies_layer_auth"

  compatible_runtimes = ["nodejs14.x"]
}

resource "aws_lambda_layer_version" "lambda_helpers" {
  filename         = "../dist/lambda_helpers_layer.zip"
  source_code_hash = filebase64sha256("../dist/lambda_helpers_layer.zip")
  layer_name       = "moggies_layer_lambda_helpers"

  compatible_runtimes = ["nodejs14.x"]
}