'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap Models, Dependencies, Routes and the app as an express app
var server = require('./server/config/systemBootstrap')(passport, db);

// Start server
server.httpServer.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, server.app.get('env'));
});

// Expose app
exports = module.exports = server.app;