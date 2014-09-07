'use strict';

var _ = require('lodash');
var Project = require('./project.model');

// Get list of projects
exports.index = function(req, res) {
  Project.find({ user : req.user._id},'-animation -history', function (err, projects) {
    if(err) { return handleError(res, err); }
    return res.json(200, projects);
  });
};

// Get a single project
exports.show = function(req, res) {
  Project.load(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(project) {
      if (project.canOpBeAppliedBy('view', req.user._id)) {
        return res.json(project);
      } else {
        return res.send(404);
      }
    } else { return res.send(404); }
  });
};

// Get a single project
exports.workgroup = function(req, res) {
  Project.load(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(project) {
      if (project.canOpBeAppliedBy('share', req.user._id)) {
        return res.json(project);
      } else {
        return res.send(404);
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
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    var updated = _.merge(project, req.body);
    updated.save(function (err) {
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
    project.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
