#! /bin/bash
[ "$ENV" = prod ] &&
   ARGS="--only=prod" ||
   ARGS=""

npm install $ARGS --prefix $1

echo "Packaging $1 to $2/$3"
cd $1 && zip -r $2/$3 ./