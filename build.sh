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

function resetBuildOutput {
	if [ -d "build/output" ]; then
		rm -r build/output
	fi

	mkdir -p build/output
}

function cpBuildOutput {
	mkdir -p "../../build/$1"
	cp -r build/output/. "../../build/$1/"
}

function buildProject {
	echo "Running build task for $1..."
	pushd $1
	resetBuildOutput
	$GRUNT_CMD ci-build
	cpBuildOutput $1
	popd ..
	echo "Completed running build task $1..."
}

echo "Using grunt from: $GRUNT_CMD"

# This file run the build tasks all packages for each project.

cd code

# common project
buildProject "common"

# model project
buildProject "model"

# timeline project
buildProject "timeline"

# view project
buildProject "view"

# site project
buildProject "site"
