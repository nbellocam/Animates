'use strict';

var _ = require('lodash');
var Project = require('./project.model');
var User = require('../user/user.model');

// Get list of projects
exports.index = function(req, res) {
  Project.list(req.user._id, function (err, projects) {
    if(err) { return handleError(res, err); }
    return res.json(200, projects);
  });
};

// Get a single project
exports.show = function(req, res) {
  Project.load(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(project) {
      if (project.canOpBeAppliedBy('play', req.user._id)) {
        return res.json(project);
      } else {
        return res.send(401);
      }
    } else { return res.send(404); }
  });
};

// Creates a new project in the DB.
exports.create = function(req, res) {
  var project = req.body;

  project.user = req.user._id;

  Project.create(project, function(err, project) {
    if(err) { return handleError(res, err); }
    return res.json(201, project);
  });
};

// Updates an existing project in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.load(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    console.log(req.body);
    console.log(req.user._id);
    if (project.canOpBeAppliedBy('edit', req.user._id)) {
      var updated = _.merge(project, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, project);
      });
    } else {
      return res.send(401);
    }
  });
};

// Add / update a collaborator to a project
exports.addCollaborator = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  var params = req.body;

  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }

      User.findOne({ email : params.email }, function (err, user){
        if (err) { return handleError(res, err); }
        if(!user) { return res.send(500, 'User was not found.'); }

        project.addCollaborator(user._id, params.permission, function (err, collaborator) {
          if (err) { return handleError(res, err); }
          return res.json(200, collaborator);
        });
      });
  });
};

// Add / update a collaborator to a project
exports.updateCollaborator = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  var params = req.body;

  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
      project.addCollaborator(req.params.userId, params.permission, function (err, collaborator) {
        if (err) { return handleError(res, err); }
        return res.json(200, collaborator);
      });
  });
};

// Remove a collaborator from a project
exports.removeCollaborator = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  var params = req.params;

  Project.findById(params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }

      project.removeCollaborator(params.userId, function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, project);
      });
  });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {

  Project.findById(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }

    if (project.canOpBeAppliedBy('delete', req.user._id)) {
      project.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.send(204);
      });
    } else {
      return res.send(401);
    }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
