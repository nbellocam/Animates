'use strict';

angular.module('animatesApp')
	.service('animationService', function animationService($window, canvasConfig) {
		var animationInstance,
			_self = this;

		this.Model = $window.model;
		this.isEditingEnable = true;

		function createAnimation() {
			var canvas = new _self.Model.Canvas({
					height: canvasConfig.canvasDefaultSize.height,
					width: canvasConfig.canvasDefaultSize.width,
					backgroundColor: '#FFFFFF'
				}),
				timeline = new _self.Model.Timeline();

			animationInstance = new _self.Model.Animation({
				canvas : canvas,
				timeline : timeline
			});

			return animationInstance;
		}

		this.getInstance = function getInstance() {
			return animationInstance || createAnimation();
		};
	});
