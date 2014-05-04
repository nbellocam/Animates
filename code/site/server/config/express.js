'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config'),
    mongoStore = require('connect-mongo')(express);

/**
 * Express configuration
 */
module.exports = function(app, passport, db) {

  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;

  // Should be placed before express.static
  // To ensure that all assets and data are compressed (utilize bandwidth)
  app.use(express.compress({
      filter: function(req, res) {
          return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
      },
      // Levels are specified in a range of 0 to 9, where-as 0 is
      // no compression and 9 is best compression, but slowest
      level: 9
  }));

  app.configure('development', function(){
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

    app.use(express.logger('dev'));
  });

  app.configure('production', function(){
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  });

  app.configure(function(){
    app.set('view engine', 'jade');
    
    // The cookieParser should be above session
    app.use(express.cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());

    // Persist sessions with mongoStore
    app.use(express.session({
      secret: config.sessionSecret,
      store: new mongoStore({
        db: db.connection.db,
        collection: config.sessionCollection
      }, function () {
          console.log("db connection open");
      })
    }));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Router (only error handlers should come after this)
    app.use(app.router);
  });

  // Error handler
  app.configure('development', function(){
    app.use(express.errorHandler());
  });
};