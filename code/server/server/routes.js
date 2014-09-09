/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/projects', require('./api/project'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // fix for an editor dialog
  app.route('/views/dialogs/settings.html')
    .get(function(req, res) {
        res.sendfile(path.join(app.get('appPath'), 'app', 'editor', 'assets', 'views', 'dialogs', 'settings.html'));
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(path.join(app.get('appPath'), 'index.html'));
    });
};
