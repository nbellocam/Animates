'use strict';

var _ = require('lodash');
var path = require('path');
var Project = require('./project.model');
var User = require('../user/user.model');
//var file_system = require('fs');
var archiver = require('archiver');

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

// Download a single project
exports.download = function(req, res) {
console.log('download file');
  Project.load(req.params.id, function (err, project) {
console.log('download file: load project');
    if(err) { return handleError(res, err); }
    if(project) {
      if (project.canOpBeAppliedBy('view', req.user._id)) {
console.log('download file: user can view');

        //var output = file_system.createWriteStream('target.zip');
        var archive = archiver('zip');

        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="animation.zip"',
        });

        archive.on('error', function(err){
            throw err;
        });

        //archive.pipe(output);
        archive.pipe(res);
        archive.append(new Buffer(JSON.stringify(project.animation)), { name:'data.json' });
        archive.bulk([
            { expand: true, cwd: path.normalize(__dirname + '/../../playerAssets'), src: ['**']}
        ]);

        return archive.finalize();


        // add animation information
        //zip.addFile("data.json", new Buffer(JSON.stringify(project.animation)), 'Animation information');
        // add player assets
        //zip.addLocalFolder(path.normalize(__dirname + '/../../playerAssets'));
        //var animationZipBuffer = zip.toBuffer();
        //zip.writeZip(__dirname + "/files.zip");

        //return res.send(animationZipBuffer);
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
    console.log(req.body);
    var updated = _.merge(project, req.body);
    console.log(updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, project);
    });
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
    project.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
