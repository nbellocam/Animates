'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

var operateWithProject = function (data, socket, operation, callback) {
	Project.load(data.projectId, function(err, project) {
		if (err) {
			socket.emit('subscribe', { error: err });
			return;
		}

		if (!project)  {
			socket.emit('subscribe', { 
				error: new Error('Failed to load project ' + data.projectId)
			});
			return;
		}

		if(project.canOpBeAppliedBy(operation, data.user.id)){
			callback(project, data, socket);
		} else {
			socket.emit('subscribe', { 
				error: new Error('Not enough permissions on project ' + data.projectId)
			});
		}
	});
};

module.exports = function(io) {

	io.of('/editor')
	.on('connection', function (socket) {
		//socket.emit('news', { hello: 'world' });
		
		socket.on('subscribe', function(data) {
			operateWithProject(data, socket, 'see', function (project, data, socket){
				socket.join(data.projectId);
			});
		});

		socket.on('unsubscribe', function(data) {
			socket.leave(data.projectId);
		});
		
		socket.on('update', function (data) {
			operateWithProject(data, socket, 'update', function (project, data, socket){
				project.applyDiff(data.diff, data.user);
				socket.broadcast.to(data.projectId).emit('update', data.diff); //emit to 'room' except this socket
			});
		});
	});

	return io;
};
