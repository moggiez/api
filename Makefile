VERSION=$(shell cat version.txt)

version-build:
	./increment_version.sh

build-cleanup:
	rm -rf ./dist/* & mkdir -p dist

build-playbook-api:
	cd code/playbook/ && zip -r ../../dist/playbook_api.$(VERSION).zip ./

build-loadtest-api:
	cd code/loadtest/ && zip -r ../../dist/loadtest_api.$(VERSION).zip ./

build: build-cleanup build-playbook-api build-loadtest-api

infra-init:
	cd infrastructure && terraform init -force-copy -backend-config="bucket=moggiez-api-terraform-state-backend" -backend-config="dynamodb_table=moggiez-api-terraform_state" -backend-config="key=terraform.state" -backend-config="region=eu-west-1"

infra-debug:
	cd infrastructure && TF_LOG=DEBUG terraform apply -auto-approve infra

deploy: build
	cd infrastructure && terraform init && TF_VAR_dist_version=$(VERSION) terraform apply -auto-approve

preview: build
	cd infrastructure && terraform init && TF_VAR_dist_version=$(VERSION) terraform plan

fmt:
	cd infrastructure && terraform fmt -recursive

undeploy:
	cd infrastructure && terraform destroy