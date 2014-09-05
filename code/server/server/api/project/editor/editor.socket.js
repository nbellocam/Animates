'use strict';

var Model = require('animates-model'),
    Project = require('../project.model');

var operateWithProject = function (data, socket, operation, callback) {
	Project.load(data.projectId, function(err, project) {
		if (err) {
			socket.emit('editor:error-response', { error: err });
			return;
		}

		if (!project)  {
			socket.emit('editor:error-response', {
				error: new Error('Failed to load project ' + data.projectId)
			});
			return;
		}

		if(project.canOpBeAppliedBy(operation, socket.decoded_token._id)){
			callback(project, data, socket);
		} else {
			socket.emit('editor:error-response', {
				error: new Error('Not enough permissions on project ' + data.projectId)
			});
		}
	});
};

exports.register = function(socket) {
	socket.on('editor:subscribe', function(data) {
		operateWithProject(data, socket, 'see', function (project, data, socket) {
			socket.join(data.projectId);
			socket.emit('editor:subscribe:ok', { projectId: data.projectId });
		});
	});

	socket.on('editor:unsubscribe', function(data) {
		socket.leave(data.projectId);
	});

	socket.on('editor:update', function (data) {
		operateWithProject(data, socket, 'update', function (project, data, socket) {
			try {
				project.applyDiff(data.target, data.operation, Model.JsonSerializer.deserializeDictionary(data.opParams), socket.decoded_token._id);
			} catch (er) {
				console.log(er);
				socket.emit('editor:update:error', data);
				return;
			}

			project.save(function(err) {
				if (err) {
					socket.emit('editor:update:error', data);
				} else {
					socket.broadcast.to(data.projectId).emit('editor:update', data); //emit to 'room' except this socket
				}
			});
		});
	});

	return socket;
};
