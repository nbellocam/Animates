'use strict';

angular.module('animatesApp')
	.service('presentationPlayerService', function canvasService($window, $rootScope, animationService, localAnimationStateService) {
		var fps = 40,
			interval = 1000 / fps,
			timer = null,
			play = false,
			_self = this;

		this.play = function () {
			var lastTick = localAnimationStateService.getCurrentTick();
			function draw() {
				if (play) {
					return setTimeout(function() {
								if (play) {
									$window.cancelAnimationFrame(timer);
									timer = $window.requestAnimationFrame(draw);
									localAnimationStateService.setCurrentTick(lastTick++);
								}
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
			play = false;
			$window.cancelAnimationFrame(timer);
			timer = null;
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
