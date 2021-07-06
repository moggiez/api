version-build:
	./increment_version.sh

build-cleanup:
	rm -rf ./dist/* & mkdir -p dist

modules-cleanup:
	cd infrastructure && rm -rf .terraform/modules

build: build-cleanup
	./scripts/package_all.sh

lint:
	npx prettier --check **/*.js

format:
	npx prettier --write **/*.js

test:
	jest --coverage

infra-init:
	cd infrastructure && terraform init -force-copy -backend-config="bucket=moggies.io-terraform-state-backend" -backend-config="dynamodb_table=moggies.io-api-terraform_state" -backend-config="key=api-terraform.state" -backend-config="region=eu-west-1"

infra-debug:
	cd infrastructure && TF_LOG=DEBUG terraform apply -auto-approve infra

deploy: build modules-cleanup
	cd infrastructure && terraform init && terraform apply -auto-approve

preview: build modules-cleanup
	cd infrastructure && terraform init && terraform plan

fmt:
	cd infrastructure && terraform fmt -recursive

undeploy:
	cd infrastructure && terraform destroy

repo-publish:
	./scripts/publish_npm_packages.sh
npm-auth:
	aws codeartifact login --tool npm --repository team-npm --domain moggies-io --domain-owner 989665778089