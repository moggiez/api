variable "name" {
  type = string
}

variable "api" {

}

variable "lambda" {

}

variable "resource_path_part" {
  type = string
}

variable "http_methods" {
  type = set(string)
}

variable "authorizer" {
  default = null
}