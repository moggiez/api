variable "api" {
}

variable "parent_api_resource" {
}

variable "lambda" {

}

variable "http_methods" {
  type = set(string)
}

variable "authorizer" {
  default = null
}