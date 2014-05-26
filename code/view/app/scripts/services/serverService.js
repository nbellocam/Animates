'use strict';

angular.module('animatesApp')
	.factory('serverService', function serverService(connectionService) {
		var connectedTo,
			currentAnimation, // TODO review as we can't use animation service because of cycle references
			applyOperation = function applyOperation (target, operation, opParams){
				if(currentAnimation) {
					currentAnimation.applyOperation(target, operation, currentAnimation.deserializeParams(opParams), {
						sender: 'serverService'
					});
				}
			},
			animationUpdateEventHandler = function animationUpdateEventHandler(target, operation, params, context) {
				if (connectedTo && context.sender !== 'serverService') {
					connectionService.emit('editor', 'update', {
						target: target,
						operation: operation,
						opParams: currentAnimation.serializeParams(params),
						projectId: connectedTo
					});
				}
			};

		if (connectionService.isAvailable()){
			connectionService.addConection('editor', '/editor');

			connectionService.on('editor','error-response', function (data){
				//TODO review errors
				console.log(data);
			});

			connectionService.on('editor','update', function (data){
				applyOperation(data.target, data.operation, data.opParams);
			});

			connectionService.on('editor','subscribe:ok', function (data){
				connectedTo = data.projectId;
			});
		}

		return {
			joinProject : function joinProject(projectId, animation){
				connectionService.emit('editor', 'subscribe', {
						projectId: projectId
					});

				currentAnimation = animation;
				animation.addUpdateObserver('serverService', animationUpdateEventHandler);
			},
			isAvailable: function isAvailable(){
				return connectionService.isAvailable();
			},
			loadProject: function loadProject(id, success, error){
				return connectionService.loadProject(id, success, error);
			}
		};
	});
