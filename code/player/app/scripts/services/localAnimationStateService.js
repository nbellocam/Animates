'use strict';

angular.module('animatesPlayer')
	.service('localAnimationStateService', function localAnimationStateService($window, animationService) {
		var currentTick = 0,
			tickObservers = {};

		animationService.getInstance().addLoadCompleteObserver('localAnimationStateService', function onAnimationLoad() {
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
