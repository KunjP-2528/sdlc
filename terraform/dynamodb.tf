resource "aws_dynamodb_table" "users" {
  name         = "${var.dynamodb_table_prefix}_users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "${var.dynamodb_table_prefix}_users"
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "tasks" {
  name         = "${var.dynamodb_table_prefix}_tasks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "assigneeId"
    type = "S"
  }

  global_secondary_index {
    name            = "assignee-index"
    hash_key        = "assigneeId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "${var.dynamodb_table_prefix}_tasks"
    Environment = var.environment
  }
}
