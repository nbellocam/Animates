'use strict';

angular.module('animatesApp')
	.service('animationService', function animationService($window, canvasConfig) {
		var model = $window.model,
			self = this,
			animationInstance;
			
		this.createAnimation = function createAnimation(height, width) {
			self.animationInstance = new model.Animation({
				canvas : {
					height: height || canvasConfig.canvasDefaultSize.height,
					width: width || canvasConfig.canvasDefaultSize.width
				}
			});
		};
		
		this.getInstance = function getInstance(){
			return self.animationInstance;
		};
	});
