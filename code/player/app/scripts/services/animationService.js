'use strict';

angular.module('animatesPlayer')
	.service('playerAnimationService', function playerAnimationService($window, playerCanvasConfig) {
		var animationInstance,
			_self = this;

		this.Model = $window.model;
		this.isEditingEnable = true;

		function createAnimation() {
			var canvas = new _self.Model.Canvas({
					height: playerCanvasConfig.canvasDefaultSize.height,
					width: playerCanvasConfig.canvasDefaultSize.width
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
