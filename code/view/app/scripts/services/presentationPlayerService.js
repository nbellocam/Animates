'use strict';

angular.module('animatesEditor')
	.service('presentationPlayerService', function canvasService($window, $rootScope, animationService, localAnimationStateService) {
		var fps = 30,
			interval = 1000 / fps,
			timer = null,
			play = false,
			_self = this,
			playStart,
			frames,
			now,
			then = Date.now(),
			delta,
			tickDuration = 20; //miliseconds

		this.play = function () {
			var lastTick = localAnimationStateService.getCurrentTick(),
				startTick = lastTick;

			playStart = Date.now();
			frames = 0;

			function draw() {
				if (play) {
					timer = $window.requestAnimationFrame(draw);
					now = Date.now();
					delta = now - then;
					if (delta > interval) {
						frames++;
						then = now - (delta % interval);
						var nextTick = Math.round(((now - playStart) / tickDuration) + startTick);

						if (nextTick !== lastTick) {
							localAnimationStateService.setCurrentTick(nextTick);
							lastTick = nextTick;
						}
					}
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

		this.tickDuration = function () {
			return tickDuration;
		};
	});
