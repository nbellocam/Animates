'use strict';

var express = require('express');
var controller = require('./project.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.put('/:id/collaborators', auth.isAuthenticated(), controller.addCollaborator);
router.delete('/:id/collaborators/:userId', auth.isAuthenticated(), controller.removeCollaborator);
router.put('/:id/collaborators/:userId', auth.isAuthenticated(), controller.updateCollaborator);
module.exports = router;
