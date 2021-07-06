# API

Lambdas providing CRUD operations on data stored in DynamoDB.

- user
- organisation
- domain
- playbook
- loadtest
- metrics

and libraries encapsulating common functionalities like database access, metrics, authentorization, etc.

# Development

TL;DR;

- Scrips are used to package lambdas and NPM packages
- Makefile used to perform previews, actual deployments, linting of the code and other common operations

## Setting up the development environment

### Install Terraform v0.14.8 or above

#### Mac OS X

Run in terminal:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -install-autocomplete
```

### Initialize terraform

Run in terminal:

```bash
make infra-init
```

### Create terraform backend in AWS (if not already created)

Run in terminal:

```bash
make terraform-backend
```

## IaC and deployment

### Deployment from your local machine

- Run `make infra-preview` to preview the deployment.
- Run `make infra-deploy` to do the actual deployment

### Automatic deployment

The application is deployed automatically with GitHub action when a push to `master` branch is made.

## Updating the version of the code

- Update the base version (it uses SemVer)
- To update the build number

```bash
make version-build
```

## Only buildiong the packages of the lambda functions

Run the code below in the terminal:

```bash
make build
```

It will output the zipped code in the `dist` folder.

# Testing

## Install jest

```bash
npm install jest --global
```
