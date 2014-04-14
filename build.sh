#!/bin/bash

# This file runs all the requiered operation for the build server for each project.

# install all dependencies
./install.sh

# This file install all packages for each project.

cd code

# common project
echo "Running build task for common..."
cd common
$GRUNT_CMD build
cd ..
echo "Completed running build task common..."

# model project
echo "Running build task model..."
cd model
$GRUNT_CMD build
cd ..
echo "Completed running build task model..."

# timeline project
echo "Running build task timeline..."
cd timeline
$GRUNT_CMD build
cd ..
echo "Completed running build task timeline..."

# view project
echo "Running build task view..."
cd view
$GRUNT_CMD build
cd ..
echo "Completed running build task view..."

# site project
echo "Running build task site..."
cd site
$GRUNT_CMD build
cd ..
echo "Completed running build task site..."
