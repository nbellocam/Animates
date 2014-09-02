'use strict';

/**
 * Send our single page app
 */
exports.player = function(req, res) {
  res.render('player', {
    project : req.project,
  });
};
