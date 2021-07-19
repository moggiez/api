resource "aws_iam_policy" "dynamodb_access_loadtests" {
  name = "lambda_api_access_dynamodb_policy_loadtests"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "loadtests" })
}

resource "aws_iam_policy" "dynamodb_access_organisations" {
  name = "lambda_api_access_dynamodb_policy_organisations"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "organisations" })
}

resource "aws_iam_policy" "dynamodb_access_loadtest_metrics" {
  name = "lambda_api_access_dynamodb_policy_loadtest_metrics"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "loadtest_metrics" })
}