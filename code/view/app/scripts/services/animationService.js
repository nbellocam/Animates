'use strict';

angular.module('animatesApp')
	.service('animationService', function animationService($window, canvasConfig, $http, connectionService) {
		var animationInstance,
			_self = this;

		this.Model = $window.model;
			
		function createAnimation() {
			var canvas = new _self.Model.Canvas({
					height: canvasConfig.canvasDefaultSize.height,
					width: canvasConfig.canvasDefaultSize.width
				}),
				timeline = new _self.Model.Timeline();

			animationInstance = new _self.Model.Animation({
				canvas : canvas,
				timeline : timeline
			});
		}

		createAnimation();

		this.loadAnimation = function loadAnimation(id) {
			console.log('loading project:' + id);
			connectionService.loadProject(id, function success(data) {
					//TODO deserialize data.Animation and loadIt
					console.log(data);
				}, function error(data) {
					console.log('Error: ' + data);
				});

		};
		
		this.getInstance = function getInstance(){
			return animationInstance;
		};
	});
