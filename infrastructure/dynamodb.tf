resource "aws_dynamodb_table" "playbooks" {
  name           = "playbooks"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "CustomerId"
  range_key      = "PlaybookId"

  attribute {
    name = "CustomerId"
    type = "S"
  }

  attribute {
    name = "PlaybookId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "loadtests" {
  name           = "loadtests"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "CustomerId"
  range_key      = "LoadtestId"

  attribute {
    name = "CustomerId"
    type = "S"
  }

  attribute {
    name = "LoadtestId"
    type = "S"
  }

  attribute {
    name = "PlaybookId"
    type = "S"
  }

  global_secondary_index {
    name            = "PlaybookLoadtestIndex"
    hash_key        = "PlaybookId"
    range_key       = "LoadtestId"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "KEYS_ONLY"
  }
}