'use strict';

var api = require('../controllers/api');

/**
 * awesomeThings routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
};