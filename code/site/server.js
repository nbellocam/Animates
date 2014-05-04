'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var models_path = path.join(__dirname, 'lib/models');
var walk = function(currentPath) {
    fs.readdirSync(currentPath).forEach(function(file) {
        var newPath = path.join(currentPath, file);
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Bootstrap passport config
require('./lib/config/passport')(passport);

var app = express();

// Express settings
require('./lib/config/express')(app, passport, db);

// Bootstrap routes
var routes_path = path.join(__dirname, 'lib/routes');
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path.join(path, file);
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app, passport, db);
            }
        // We skip the app/routes/middlewares directory as it is meant to be
        // used and shared by routes as further middlewares and is not a 
        // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walk(newPath);
        }
    });
};
walk(routes_path);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;