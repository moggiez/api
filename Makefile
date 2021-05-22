VERSION=$(shell cat version.txt)

version-build:
	./increment_version.sh

build-cleanup:
	rm -rf ./dist/* & mkdir -p dist

modules-cleanup:
	cd infrastructure && rm -rf .terraform/modules

build-playbook-api:
	cd code/playbook/ && zip -r ../../dist/playbook_api.$(VERSION).zip ./

build-loadtest-api:
	cd code/loadtest/ && zip -r ../../dist/loadtest_api.$(VERSION).zip ./

build-organisation-api:
	cd code/organisation/ && zip -r ../../dist/organisation_api.$(VERSION).zip ./

build-domain-api:
	cd code/domain/ && zip -r ../../dist/domain_api.$(VERSION).zip ./

build-user-api:
	cd code/user/ && zip -r ../../dist/user_api.$(VERSION).zip ./

build-layer-db:
	cd code/libs/db && zip -rv ../../../dist/db_layer.zip ./

build-layer-auth:
	cd code/libs/auth && zip -rv ../../../dist/auth_layer.zip ./

build-layer-lambda_helpers:
	cd code/libs/lambda_helpers && zip -rv ../../../dist/lambda_helpers_layer.zip ./

build-layers: build-layer-db build-layer-auth build-layer-lambda_helpers

build-lambdas: build-playbook-api build-loadtest-api build-organisation-api build-domain-api build-user-api

build: build-cleanup build-layers build-lambdas

infra-init:
	cd infrastructure && terraform init -force-copy -backend-config="bucket=moggies.io-terraform-state-backend" -backend-config="dynamodb_table=moggies.io-api-terraform_state" -backend-config="key=api-terraform.state" -backend-config="region=eu-west-1"

infra-debug:
	cd infrastructure && TF_LOG=DEBUG terraform apply -auto-approve infra

deploy: build modules-cleanup
	cd infrastructure && terraform init && TF_VAR_dist_version=$(VERSION) terraform apply -auto-approve

preview: build modules-cleanup
	cd infrastructure && terraform init && TF_VAR_dist_version=$(VERSION) terraform plan

fmt:
	cd infrastructure && terraform fmt -recursive

undeploy:
	cd infrastructure && terraform destroy