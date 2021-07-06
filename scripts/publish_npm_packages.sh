#! /bin/bash

LIBS_DIR=$PWD/code/libs
PACKAGES=("db" "auth" "lambda_helpers" "metrics")

for pkg in "${PACKAGES[@]}"
do
    echo "Publishing package '$pkg'..."
	cd $LIBS_DIR/$pkg && npm publish
    echo ""
done