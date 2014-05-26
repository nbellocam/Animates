'use strict';

angular.module('animatesApp')
	.factory('serverService', function serverService(connectionService, animationService) {
		var connectedTo,
			applyOperation = function applyOperation (target, operation, opParams){
				animationService.getInstance().applyOperation(target, operation, animationService.Model.JsonSerializer.deserializeDictionary(opParams), {
					sender: 'serverService'
				});
			},
			animationUpdateEventHandler = function animationUpdateEventHandler(target, operation, params, context) {
				if (connectedTo && context.sender !== 'serverService') {
					connectionService.emit('editor', 'update', {
						target: target,
						operation: operation,
						opParams: animationService.Model.JsonSerializer.serializeDictionary(params),
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
			joinProject : function joinProject(projectId){
				connectionService.emit('editor', 'subscribe', {
						projectId: projectId
					});

				animationService.getInstance().addUpdateObserver('serverService', animationUpdateEventHandler);
			},
			isAvailable: function isAvailable(){
				return connectionService.isAvailable();
			},
			loadProject: function loadProject(id, success, error){
				return connectionService.loadProject(id, success, error);
			}
		};
	});
