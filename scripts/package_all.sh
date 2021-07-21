#! /bin/bash

CODE_DIR=$PWD/code
LIBS_DIR=$PWD/code/libs
DIST_DIR=$PWD/dist
LOCAL_ENV=prod

[ "$ENV" = dev ] &&
   LOCAL_ENV=dev ||
   LOCAL_ENV=prod

PACKAGES=("db" "auth" "lambda_helpers" "metrics")

for pkg in "${PACKAGES[@]}"
do
    echo "Building package '$pkg'..."
    rm -r $CODE_DIR/libs/$pkg/node_modules
	ENV=$LOCAL_ENV $PWD/scripts/build_and_package_api.sh $CODE_DIR/libs/$pkg $DIST_DIR ${pkg}_pkg.zip
done 