'use strict';

angular.module('animatesPlayer')
	.service('playerLocalAnimationStateService', function playerLocalAnimationStateService($window, playerAnimationService) {
		var currentTick = 0,
			tickObservers = {};

		playerAnimationService.getInstance().addLoadCompleteObserver('playerLocalAnimationStateService', function onAnimationLoad() {
			currentTick = -1;
		});

		this.addTickObserver = function addTickObserver(observerId, callback) {
			tickObservers[observerId] = callback;
		};

		this.setCurrentTick = function (tick) {
			var finalTick = (tick >= 0) ? tick : 0;

			if (finalTick !== currentTick) {
				currentTick = finalTick;
				for (var observerId in tickObservers) {
					if (tickObservers.hasOwnProperty(observerId)) {
						tickObservers[observerId](currentTick);
					}
				}
			}
		};

		this.getCurrentTick = function () {
			return currentTick;
		};
	});
