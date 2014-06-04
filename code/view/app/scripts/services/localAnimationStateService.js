'use strict';

angular.module('animatesApp')
	.service('localAnimationStateService', function localAnimationStateService($window, animationService) {
		var currentTick = 0,
			tickObservers = {};

		animationService.getInstance().addLoadCompleteObserver('localAnimationStateService', function onAnimationLoad() {
			currentTick = 0;
		});
		
		this.addTickObserver = function addTickObserver(observerId, callback) {
			tickObservers[observerId] = callback;
		};

		this.setCurrentTick = function (tick) {
			currentTick = tick;
			for (var observerId in tickObservers) {
				if (tickObservers.hasOwnProperty(observerId)) {
					tickObservers[observerId](currentTick);
				}
			}
		};
		
		this.getCurrentTick = function () {
			return currentTick;
		};
		
		this.startsAtCurrentTick = function (mediaTimeline) {
			return mediaTimeline.getStartTick() === currentTick;
		};
	});
