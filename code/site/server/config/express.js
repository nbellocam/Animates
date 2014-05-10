'use strict';

var express = require('express'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config'),
    appPath = process.cwd(),
    util = require('../utils/util'),
    MongoStore = require('connect-mongo')(session);

/**
 * Express configuration
 */
module.exports = function(app, passport, db) {
  var env = app.get('env');

  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;

  if ('development' === env) {
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.set('views', config.root + '/app/views');
  }

  if ('production' === env) {
    app.use(compression());
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  }

  // Enable jsonp
  //app.enable('jsonp callback');

  app.set('view engine', 'jade');

  // Logger
  app.use(morgan('dev'));

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser());
  app.use(methodOverride());

  // The cookieParser should be above session
  app.use(cookieParser());

  // Persist sessions with mongoStore
  app.use(session({
    key: config.sessionKey,
    secret: config.sessionSecret,
    store: new MongoStore({
      mongoose_connection: db.connection,
      collection: config.sessionCollection
    }, function () {
        console.log("db connection open");
    })
  }));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // Error handler - has to be last
  if ('development' === app.get('env')) {
    app.use(errorHandler());
  }

  function bootstrapRoutes() {
    // Skip the app/routes/middlewares directory as it is meant to be
    // used and shared by routes as further middlewares and is not a
    // route by itself
    util.walk(path.join(appPath, '/server/routes'), 'middlewares', function(currentPath, file) {
      if (!/^index\.(js|coffee)$/.test(file)) {
        require(currentPath)(app, passport);
      }
    });

    // Add default routes
    require(path.join(appPath, '/server/routes/index'))(app, passport);
  }

  bootstrapRoutes();
};