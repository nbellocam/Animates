'use strict';

var path = require('path'),
	socketIO= require('socket.io'),
	appPath = process.cwd(),
	util = require('../utils/util');


module.exports = function(httpServer, app, passport, db) {
	var env = app.get('env');

	var io = socketIO.listen(httpServer);

	if ('production' === env) {
		io.enable('browser client minification');  // send minified client
		io.enable('browser client etag');          // apply etag caching logic based on version number
		io.enable('browser client gzip');          // gzip the file
	}

	function bootstrapNamespaces() {
		// Bootstrap socket io namespaces
		util.walk(path.join(appPath, '/server/socketNamespaces'), null, function(currentPath) {
			require(currentPath);
		});
	}

	bootstrapNamespaces();

	return io;
};
