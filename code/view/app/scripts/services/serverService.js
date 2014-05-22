'use strict';

angular.module('animatesApp')
	.factory('serverService', function serverService(connectionService, animationService) {
		var connectedTo,
			applyOperation = function applyOperation (target, operation, opParams){
				animationService.getInstance().applyOperation(target, operation, opParams, {
					sender: 'serverService'
				});
			},
			animationUpdateEventHandler = function animationUpdateEventHandler(target, operation, params, context) {
				if (connectedTo && context.sender !== 'serverService') {
					connectionService.emit('editor', 'update', {
						target: target,
						operation: operation,
						opParams: params
					}, function (){
						//TODO review response.
					});
				}
			};

		if (connectionService.isAvailable()){
			connectionService.addConection('editor', '/editor');

			connectionService.on('editor','error-response', function (){
				//TODO review errors
			});

			connectionService.on('editor','update', function (data){
				applyOperation(data.target, data.operation, data.opParams);
			});

			animationService.getInstance().addUpdateObserver('serverService', animationUpdateEventHandler);
		}

		return {
			joinProject : function joinProject(projectId){
				connectionService.emit('editor', 'subscribe', {
						projectId: projectId
					}, function (){
						connectedTo = projectId;
					});
			}
		};
	});
