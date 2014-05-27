'use strict';

angular.module('animatesApp')
	.service('localAnimationStateService', function localAnimationStateService($window, animationService) {
		var currentTick = 0;

		animationService.getInstance().addLoadCompleteObserver('localAnimationStateService', function onAnimationLoad() {
			currentTick = 0;
		});
		
		this.setCurrentTick = function (tick) {
			currentTick = tick;
		};
		
		this.getCurrentTick = function () {
			return currentTick;
		};
		
		this.startsAtCurrentTick = function (mediaTimeline) {
			return mediaTimeline.getStartTick() === currentTick;
		};
	});
