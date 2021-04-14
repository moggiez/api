variable "name" {
  type = string
}

variable "path_part" {
  type = string
}

variable "bucket" {
}

variable "dist_version" {
  type    = string
  default = "1.0.0"
}

variable "dist_dir" {
  type    = string
  default = "../../dist"
}