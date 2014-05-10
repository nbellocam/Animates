'use strict';

var express = require('express'),
    path = require('path'),
    http = require('http'),
    appPath = process.cwd();


module.exports = function(passport, db) {

    function bootstrapModels() {
        // Bootstrap models
        require('../utils/util').walk(path.join(appPath, '/server/models'), null, function(currentPath) {
            require(currentPath);
        });
    }

    bootstrapModels();

    // Populate empty DB with sample data
	require('./dummydata');

    // Bootstrap passport config
    require(path.join(appPath, '/server/config/passport'))(passport);

    // Express settings
    var app = express();
    require(path.join(appPath, '/server/config/express'))(app, passport, db);

    var httpServer = http.createServer(app);
    var io = require(path.join(appPath, '/server/config/socketio'))(httpServer, app, passport, db);

    return {
        app: app,
        httpServer: httpServer,
        socketIo: io
    };
};
