'use strict';

var index = require('../controllers/index'),
    cookieSession = require('./middlewares/cookieSession');

module.exports = function(app) {
    // All undefined api routes should return a 404
    app.route('/api/*')
        .get(function(req, res) {
            res.send(404);
        });

    // All other routes to use Angular routing in app/scripts/app.js
    app.route('/partials/*')
        .get(index.partials);
        
    app.route('/*')
        .get(cookieSession.setUserCookie,  index.index);
};