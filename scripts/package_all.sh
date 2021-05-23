#! /bin/bash

CODE_DIR=$PWD/code
LIBS_DIR=$PWD/code/libs
DIST_DIR=$PWD/dist
APIS=("user" "organisation" "domain" "playbook" "loadtest")
LAYERS=("db" "auth" "lambda_helpers")
 
for api in "${APIS[@]}"
do
    echo "Building api '$api'..."
	$PWD/scripts/build_and_package_api.sh $CODE_DIR/$api $DIST_DIR ${api}_api.zip
    echo ""
done

for layer in "${LAYERS[@]}"
do
    echo "Building layer '$layer'..."
	$PWD/scripts/build_and_package_layer.sh $LIBS_DIR/$layer $DIST_DIR ${layer}_layer.zip
    echo ""
done