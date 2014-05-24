#!/bin/bash

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

echo "Using grunt from: $GRUNT_CMD"

# This file install all packages for each project.

cd code

# common project
echo "Installing common..."
cd common
npm install
npm link
cd ..
echo "Completed installing common..."

# model project
echo "Installing model..."
cd model
npm link animates-common
npm install
npm link
$GRUNT_CMD package
cd ..
echo "Completed installing model..."

# timeline project
echo "Installing timeline..."
cd timeline
npm install
bower install
$GRUNT_CMD package
cd ..
echo "Completed installing timeline..."

# view project
echo "Installing view..."
cd view
npm install
bower install
$GRUNT_CMD install-dep
cd ..
echo "Completed installing view..."

# site project
echo "Installing site..."
cd site
npm link animates-model
npm install
bower install
$GRUNT_CMD install-dep
cd ..
echo "Completed installing site..."

cd ..
