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

echo
echo -e "\e[1;4;33mUsing grunt from: $GRUNT_CMD"
echo

function resetBuildOutput {
	if [ -d "build/output" ]; then
		rm -rf build/output
	fi

	mkdir -p build/output
}

function replacePathInPaths {
	sed -E "s@(file name)=\"([^\"]*)\"@\1=\"$1\/\2\"@g" jshint-result.xml > jshint-result.xml.tmp
	mv jshint-result.xml.tmp jshint-result.xml
}

function cpBuildOutput {
	mkdir -p "../../build/$1"
	cp -r build/output/. "../../build/$1/"

	pushd "../../build/$1/"
	replacePathInPaths "$1"
	popd
}

function buildProject {
	echo
	echo -e "\e[1;4;33m=============="
	echo -e "\e[1;4;33mRunning build task for $1..."
	echo -e "\e[1;4;33m=============="

	pushd $1
	resetBuildOutput
	$GRUNT_CMD ci-build
	cpBuildOutput $1
	popd

	echo
	echo -e "\e[1;4;33m=============="
	echo -e "\e[1;4;33mCompleted running build task $1..."
	echo -e "\e[1;4;33m=============="
	echo
}

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

# view project
buildProject "player"

# site project
buildProject "server"
