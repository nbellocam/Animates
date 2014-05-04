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

    app.get('/api/projects', projects.all);
    app.post('/api/projects', authorization.requiresLogin, projects.create);
    app.get('/api/projects/:projectId', projects.show);
    app.put('/api/projects/:projectId', authorization.requiresLogin, hasAuthorization, projects.update);
    app.del('/api/projects/:projectId', authorization.requiresLogin, hasAuthorization, projects.destroy);

    app.get('/editor', editor.editor);

    // Finish with setting up the projectId param
    app.param('projectId', projects.project);
};