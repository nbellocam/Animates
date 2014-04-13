#!/bin/bash

# This file runs all the requiered operation for the build server for each project.

# server project
./install.sh
cd code/server
npm install
./node_modules/.bin/mocha --recursive -R xunit test/ > ../../build/test-reports/server.xml
cd ../..
