#! /bin/bash

CODE_DIR=$PWD/code
LIBS_DIR=$PWD/code/libs
DIST_DIR=$PWD/dist
APIS=("user" "organisation" "domain" "playbook" "loadtest" "metrics")
 
for api in "${APIS[@]}"
do
    echo "Building api '$api'..."
    rm -r $CODE_DIR/$api/node_modules
	$PWD/scripts/build_and_package_api.sh $CODE_DIR/$api $DIST_DIR ${api}_api.zip
    echo ""
done