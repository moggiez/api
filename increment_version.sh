# !/bin/bash

IN=$(cat version.txt)
VERSION=$(cat version.txt | cut -d"-" -f1)
BUILD=$(cat version.txt | cut -d"-" -f2)

if [[ $BUILD == $VERSION ]]
then
    BUILD=0
fi

NEWBUILD=$((BUILD+1))
echo $VERSION-$NEWBUILD > version.txt
echo $(cat version.txt)