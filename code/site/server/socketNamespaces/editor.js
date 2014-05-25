'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

var operateWithProject = function (data, socket, operation, callback) {
	Project.load(data.projectId, function(err, project) {
		if (err) {
			socket.emit('error-response', { error: err });
			return;
		}

		if (!project)  {
			socket.emit('error-response', { 
				error: new Error('Failed to load project ' + data.projectId)
			});
			return;
		}

		if(project.canOpBeAppliedBy(operation, socket.handshake.user.id)){
			callback(project, data, socket);
		} else {
			socket.emit('error-response', { 
				error: new Error('Not enough permissions on project ' + data.projectId)
			});
		}
	});
};

module.exports = function(io) {

	io.of('/editor')
	.on('connection', function (socket) {
		socket.on('subscribe', function(data) {
			operateWithProject(data, socket, 'see', function (project, data, socket){
				socket.join(data.projectId);
				socket.emit('subscribe:ok', { projectId: data.projectId });
			});
		});

		socket.on('unsubscribe', function(data) {
			socket.leave(data.projectId);
		});
		
		socket.on('update', function (data) {
			operateWithProject(data, socket, 'update', function (project, data, socket){
				project.applyDiff(data.target, data.operation, data.opParams, socket.handshake.user);
				project.save(function(err) {
					if (err) {
						socket.emit('update:error', data);
					} else {
						socket.broadcast.to(data.projectId).emit('update', data); //emit to 'room' except this socket
					}
				});				
			});
		});
	});

	return io;
};
