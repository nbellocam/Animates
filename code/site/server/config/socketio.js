'use strict';

var path = require('path'),
	socketIO= require('socket.io'),
	appPath = process.cwd(),
	util = require('../utils/util'),
    config = require('./config'),
    cookieParser = require('cookie-parser'),
	passportSocketIo = require("passport.socketio");


module.exports = function(httpServer, app, passport, db, appModules) {
	var env = app.get('env');

	var io = socketIO.listen(httpServer);

	if ('production' === env) {
		io.enable('browser client minification');  // send minified client
		io.enable('browser client etag');          // apply etag caching logic based on version number
		//io.enable('browser client gzip');          // gzip the file
	}

	function onAuthorizeSuccess(data, accept){
		console.log('successful connection to socket.io');

		// The accept-callback still allows us to decide whether to
		// accept the connection or not.
		accept(null, true);
	}

	function onAuthorizeFail(data, message, error, accept){
		if(error) {
			throw new Error(message);
		}

		console.log('failed connection to socket.io:', message);

		// We use this callback to log all of our failed connections.
		accept(null, false);
	}

	// set authorization for socket.io
	io.set('authorization', passportSocketIo.authorize({
		cookieParser: cookieParser,
		key:          config.sessionKey,        // the name of the cookie where express/connect stores its session_id
		secret:       config.sessionSecret,     // the session_secret to parse the cookie
		store:        appModules.sessionStore,  // we NEED to use a sessionstore. no memorystore please
		success:      onAuthorizeSuccess,       // *optional* callback on success - read more below
		fail:         onAuthorizeFail,          // *optional* callback on fail/error - read more below
	}));

	function bootstrapNamespaces() {
		// Bootstrap socket io namespaces
		util.walk(path.join(appPath, '/server/socketNamespaces'), null, function(currentPath) {
			require(currentPath)(io);
		});
	}

	bootstrapNamespaces();

	return io;
};
