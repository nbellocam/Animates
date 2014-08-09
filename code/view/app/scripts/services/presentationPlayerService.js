'use strict';

angular.module('animatesApp')
	.service('presentationPlayerService', function canvasService($window, $rootScope, animationService, localAnimationStateService) {
		var fps = 30,
			interval = 1000 / fps,
			timer = null,
			play = false,
			_self = this;

		this.play = function () {
			function draw() {
				if (play) {
					return setTimeout(function() {
								timer = $window.requestAnimationFrame(draw);
								localAnimationStateService.setCurrentTick(localAnimationStateService.getCurrentTick() + 1);
							}, interval);
				}
			}

			if (!play) {
				play = true;
				animationService.isEditingEnable = false;
				draw();
			}
		};

		this.pause = function () {
			$window.cancelAnimationFrame(timer);
			timer = null;
			play = false;
			animationService.isEditingEnable = true;
		};

		this.stop = function () {
			_self.pause();
			localAnimationStateService.setCurrentTick(0);
		};

		this.stepForward = function (step) {
			localAnimationStateService.setCurrentTick(localAnimationStateService.getCurrentTick() + step);
		};

		this.stepBackward = function (step) {
			localAnimationStateService.setCurrentTick(localAnimationStateService.getCurrentTick() - step);
		};
	});
