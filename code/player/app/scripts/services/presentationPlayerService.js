'use strict';

angular.module('animatesPlayer')
	.service('playerPresentationPlayerService', function playerCanvasService($window, $rootScope, playerAnimationService, playerLocalAnimationStateService) {
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
			var lastTick = playerLocalAnimationStateService.getCurrentTick(),
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
							playerLocalAnimationStateService.setCurrentTick(nextTick);
							lastTick = nextTick;
						}
					}
				}
			}

			if (!play) {
				play = true;
				playerAnimationService.isEditingEnable = false;
				draw();
			}
		};

		this.pause = function () {
			play = false;
			$window.cancelAnimationFrame(timer);
			timer = null;
			playerAnimationService.isEditingEnable = true;
		};

		this.stop = function () {
			_self.pause();
			playerLocalAnimationStateService.setCurrentTick(0);
		};

		this.stepForward = function (step) {
			playerLocalAnimationStateService.setCurrentTick(playerLocalAnimationStateService.getCurrentTick() + step);
		};

		this.stepBackward = function (step) {
			playerLocalAnimationStateService.setCurrentTick(playerLocalAnimationStateService.getCurrentTick() - step);
		};

		this.tickDuration = function () {
			return tickDuration;
		};
	});
