#! /bin/bash

LIBS_DIR=$PWD/code/libs
PACKAGES=("auth" "lambda_helpers" "metrics")

for pkg in "${PACKAGES[@]}"
do
    echo "Publishing package '$pkg'..."
	cd $LIBS_DIR/$pkg/nodejs/node_modules && npm publish
    echo ""
done

PACKAGES=("db")

for pkg in "${PACKAGES[@]}"
do
    echo "Publishing package '$pkg'..."
	cd $LIBS_DIR/$pkg && npm publish
    echo ""
done