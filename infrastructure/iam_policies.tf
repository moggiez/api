resource "aws_iam_policy" "dynamodb_access_loadtests" {
  name = "lambda_api_access_dynamodb_policy_loadtests"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "loadtests" })
}

resource "aws_iam_policy" "dynamodb_access_playbooks" {
  name = "lambda_api_access_dynamodb_policy_playbooks"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "playbooks" })
}

resource "aws_iam_policy" "dynamodb_access_organisations" {
  name = "lambda_api_access_dynamodb_policy_organisations"
  path = "/"

  policy = templatefile("templates/dynamo_access_policy.json", { table = "organisations" })
}