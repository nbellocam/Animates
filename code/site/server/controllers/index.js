'use strict';

var path = require('path'),
    fs = require('fs');

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  var htmlFilePath = path.join('./views', stripped) + '.html';
  fs.exists(htmlFilePath, function (exists) {
    if (exists){
      res.sendfile(htmlFilePath);
    } else {
      res.render(requestedView, function(err, html) {
        if(err) {
          console.log("Error rendering partial '" + requestedView + "'\n", err);
          res.status(404);
          res.send(404);
        } else {
          res.send(html);
        }
      });
    }
  });
};

/**
 * Send our single page app
 */
exports.index = function(req, res) {
  // Send some basic starting info to the view
  res.render('index', {
      user: req.user ? JSON.stringify({
          name: req.user.name,
          _id: req.user._id,
          username: req.user.username,
          roles: (req.user ? req.user.roles : ['anonymous'])
      }) : 'null'
  });
};

/**
 * Send our single page app
 */
exports.home = function(req, res) {
  if (req.isAuthenticated()){
    // Send some basic starting info to the view
    res.render('index', {
        user: req.user ? JSON.stringify({
            name: req.user.name,
            _id: req.user._id,
            username: req.user.username,
            roles: (req.user ? req.user.roles : ['anonymous'])
        }) : 'null'
    });
  } else {
    res.render('home');
  }
};
