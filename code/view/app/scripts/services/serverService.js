'use strict';

angular.module('animatesEditor')
	.service('serverService', function serverService(animationService) {
		var connectedTo,
			socket,
			applyOperation = function applyOperation (target, operation, opParams) {
				animationService.getInstance().applyOperation(target, operation, animationService.Model.JsonSerializer.deserializeDictionary(opParams), {
					sender: 'serverService'
				});
			},
			animationUpdateEventHandler = function animationUpdateEventHandler(target, operation, params, context) {
				if (connectedTo && context.sender !== 'serverService') {
					socket.emit('editor:update', {
						target: target,
						operation: operation,
						opParams: animationService.Model.JsonSerializer.serializeDictionary(params),
						projectId: connectedTo
					});
				}
			};

		this.connect = function (channel) {
			if (channel !== undefined) {
				socket = channel;
				socket.on('editor:error-response', function (data) {
					//TODO review errors
					console.log(data);
				});

				socket.on('editor:update', function (data) {
					applyOperation(data.target, data.operation, data.opParams);
				});

				socket.on('editor:subscribe:ok', function (data) {
					connectedTo = data.projectId;
				});
			}
		};

		this.joinProject = function (projectId) {
			socket.emit('editor:subscribe', {
					projectId: projectId
				});

			animationService.getInstance().addUpdateObserver('serverService', animationUpdateEventHandler);
		};

		this.isAvailable = function () {
			return socket !== undefined;
		};
	});
