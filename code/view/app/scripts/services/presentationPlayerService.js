'use strict';

angular.module('animatesApp')
	.service('presentationPlayerService', function canvasService($window, $rootScope, animationService, localAnimationStateService) {
		var fps = 30,
			interval = 1000 / fps,
			timer = null,
			play = false,
			_self = this;

		this.play = function () {
			play = true;
			function draw() {
				if (play) {
					return setTimeout(function() {
								timer = $window.requestAnimationFrame(draw);
								localAnimationStateService.setCurrentTick(localAnimationStateService.getCurrentTick() + 1);
							}, interval);
				}
			}
			draw();
		};

		this.pause = function () {
			$window.cancelAnimationFrame(timer);
			timer = null;
			play = false;
		};

		this.stop = function () {
			_self.pause();
			localAnimationStateService.setCurrentTick(0);
		};
	});