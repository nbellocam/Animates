'use strict';

angular.module('animatesApp')
	.service('localAnimationStateService', function localAnimationStateService($window, animationService) {
		var currentTick = 0,
			tickObservers = {},
			selectedShape = null,
			selectedShapeObservers = {},
			selectedEffect = null,
			selectedEffectObservers = {};

		animationService.getInstance().addLoadCompleteObserver('localAnimationStateService', function onAnimationLoad() {
			currentTick = 0;
		});

		this.addTickObserver = function addTickObserver(observerId, callback) {
			tickObservers[observerId] = callback;
		};

		this.addSelectedShapeObserver = function addSelectedShapeObserver(observerId, callback) {
			selectedShapeObservers[observerId] = callback;
		};

		this.addSelectedEffectObserver = function addSelectedEffectObserver(observerId, callback) {
			selectedEffectObservers[observerId] = callback;
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

		this.startsAtCurrentTick = function (mediaTimeline) {
			return mediaTimeline.getStartTick() === currentTick;
		};

		this.setSelectedShape = function (shape) {
			selectedShape = shape;
			for (var observerId in selectedShapeObservers) {
				if (selectedShapeObservers.hasOwnProperty(observerId)) {
					selectedShapeObservers[observerId](selectedShape);
				}
			}
		};

		this.getSelectedShape = function () {
			return selectedShape;
		};

		this.setSelectedEffect = function (effect) {
			selectedEffect = effect;
			for (var observerId in selectedEffectObservers) {
				if (selectedEffectObservers.hasOwnProperty(observerId)) {
					selectedEffectObservers[observerId](selectedEffect);
				}
			}
		};

		this.getSelectedEffect = function () {
			return selectedEffect;
		};
	});
