'use strict';

// Articles routes use projects controller
var projects = require('../controllers/projects'),
    editor = require('../controllers/editor');

var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (req.project.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.route('/api/projects')
        .get(projects.all)
        .post(authorization.requiresLogin, projects.create);
    
    app.route('/api/projects/:projectId')
        .get(projects.show)
        .put(authorization.requiresLogin, hasAuthorization, projects.update)
        .delete(authorization.requiresLogin, hasAuthorization, projects.destroy);
    
    app.route('/editor/:projectId')
        .get(authorization.requiresLogin, hasAuthorization, editor.editor);

    //temporal route
    app.route('/editor')
        .get(projects.all);

    // Finish with setting up the projectId param
    app.param('projectId', projects.project);
};