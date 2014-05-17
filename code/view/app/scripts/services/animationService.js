'use strict';

angular.module('animatesApp')
	.service('animationService', function animationService($window, canvasConfig) {
		var Model = $window.model,
			animationInstance;
			
		this.createAnimation = function createAnimation(height, width) {
			var canvas = new Model.Canvas({
					height: height || canvasConfig.canvasDefaultSize.height,
					width: width || canvasConfig.canvasDefaultSize.width
				}),
				timeline = new Model.Timeline();

			animationInstance = new Model.Animation({
				canvas : canvas,
				timeline : timeline
			});
		};
		
		this.getInstance = function getInstance(){
			return animationInstance;
		};
	});
