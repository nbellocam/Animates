#!/bin/bash

# This file runs all the requiered operation for the build server for each project.

# install all dependencies
./install.sh

if [[ ! -n "$GRUNT_CMD" ]]; then
	GRUNT_CMD=`command -v grunt`

	if [[ ! -n "$GRUNT_CMD" ]]; then
	  echo "Grunt was not found."
	  pushd ..
	  npm install grunt-cli

	  if [ ! $? -eq 0 ]; then
	    echo "An error has occurred during installing grunt-cli."
	    exit 1
	  fi

	  BASEPATH=$PWD
	  GRUNT_CMD="$BASEPATH/node_modules/grunt-cli/bin/grunt"
	  popd
	fi
fi

echo "Using grunt from: $GRUNT_CMD"

# This file run the build tasks all packages for each project.

cd code

# common project
echo "Running build task for common..."
cd common
$GRUNT_CMD ci-build
cd ..
echo "Completed running build task common..."

# model project
echo "Running build task model..."
cd model
$GRUNT_CMD ci-build
cd ..
echo "Completed running build task model..."

# timeline project
echo "Running build task timeline..."
cd timeline
$GRUNT_CMD ci-build
cd ..
echo "Completed running build task timeline..."

# view project
echo "Running build task view..."
cd view
$GRUNT_CMD ci-build
cd ..
echo "Completed running build task view..."

# site project
echo "Running build task site..."
cd site
$GRUNT_CMD ci-build
cd ..
echo "Completed running build task site..."
