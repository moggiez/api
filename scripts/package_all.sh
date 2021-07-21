#! /bin/bash

CODE_DIR=$PWD/code
LIBS_DIR=$PWD/code/libs
DIST_DIR=$PWD/dist
LOCAL_ENV=prod

[ "$ENV" = dev ] &&
   LOCAL_ENV=dev ||
   LOCAL_ENV=prod

APIS=("metrics")
PACKAGES=("db" "auth" "lambda_helpers" "metrics")

for api in "${APIS[@]}"
do
    echo "Building api '$api'..."
    rm -r $CODE_DIR/$api/node_modules
	ENV=$LOCAL_ENV $PWD/scripts/build_and_package_api.sh $CODE_DIR/$api $DIST_DIR ${api}_api.zip
    echo ""
done

for pkg in "${PACKAGES[@]}"
do
    echo "Building package '$pkg'..."
    rm -r $CODE_DIR/libs/$pkg/node_modules
	ENV=$LOCAL_ENV $PWD/scripts/build_and_package_api.sh $CODE_DIR/libs/$pkg $DIST_DIR ${pkg}_pkg.zip
done 