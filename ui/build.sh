#! /bin/bash -e

rm -rf ./build/html/
mkdir ./build/html/

browserify ./ui/index.js -o  ./build/html/bundle.js
cp ./ui/index.html ./build/html/

echo "Done building \"./build/html\" at `date`"


