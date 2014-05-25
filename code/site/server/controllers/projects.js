'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    //Model = require('animates-model'),
    _ = require('lodash');


/**
 * Find project by id
 */
exports.project = function(req, res, next, id) {
    Project.load(id, function(err, project) {
        if (err) return next(err);
        if (!project) return next(new Error('Failed to load project ' + id));
        req.project = project;
        next();
    });
};

/**
 * Create a project
 */
exports.create = function(req, res) {
    var project = new Project(req.body);
    project.user = req.user._id;
    //var animation = new Model.Animation();
    //project.animation = animation.toJson();
    project.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                project: project
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * Update a project
 */
exports.update = function(req, res) {
    var project = req.project;

    if (project.canOpBeAppliedBy('update', req.user.id)){
        project = _.extend(project, req.body);

        project.save(function(err) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    project: project
                });
            } else {
                res.jsonp(project);
            }
        });
    } else {
        return res.json(401, { message: 'Unauthorized' });
    }
};

/**
 * Delete an project
 */
exports.destroy = function(req, res) {
    var project = req.project;

    if (project.canOpBeAppliedBy('delete', req.user.id)){
        project.remove(function(err) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    project: project
                });
            } else {
                res.jsonp(project);
            }
        });
    } else {
        return res.json(401, { message: 'Unauthorized' });
    }
};

/**
 * Show an project
 */
exports.show = function(req, res) {
    if (req.project.canOpBeAppliedBy('see', req.user.id)){
        res.jsonp(req.project);
    } else {
        return res.json(401, { message: 'Unauthorized' });
    }
};

/**
 * List of Projects
 */
exports.all = function(req, res) {
    Project.find({ 'user': req.user._id })
    //.or()
    //.where('workgroup.user').equals(req.user._id)
    .sort('-created').populate('user', 'name username').exec(function(err, projects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(projects);
        }
    });
};