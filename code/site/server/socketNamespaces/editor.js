'use strict';

module.exports = function(io) {

	io.of('/editor')
	.on('connection', function (socket) {
		//socket.emit('news', { hello: 'world' });
		
		socket.on('subscribe', function(data) {
			socket.join(data.projectId);
		});

		socket.on('unsubscribe', function(data) {
			socket.leave(data.projectId);
		});
		
		socket.on('update', function (data) {
			socket.broadcast.to(data.projectId).emit('update', data.diff); //emit to 'room' except this socket
		});
	});

	return io;
};
