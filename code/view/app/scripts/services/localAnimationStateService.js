'use strict';

angular.module('animatesApp')
	.service('localAnimationStateService', function localAnimationStateService($window, animationService) {
		var currentTick = 0,
			tickObservers = {},
			selectedShape = null,
			selectedShapeObservers = {},
			selectedEffect = null,
			selectedMediaObjectId = null,
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

		var setSelectedShape = function (shape) {
			selectedShape = shape;
			for (var observerId in selectedShapeObservers) {
				if (selectedShapeObservers.hasOwnProperty(observerId)) {
					selectedShapeObservers[observerId](selectedShape);
				}
			}
		};
		this.setSelectedShape = setSelectedShape;

		this.getSelectedShape = function () {
			return selectedShape;
		};

		var setSelectedEffect = function (effect, mediaObjectId) {
			selectedEffect = effect;
			selectedMediaObjectId = mediaObjectId;
			for (var observerId in selectedEffectObservers) {
				if (selectedEffectObservers.hasOwnProperty(observerId)) {
					selectedEffectObservers[observerId](selectedEffect, selectedMediaObjectId);
				}
			}
		};

		this.setSelectedEffect = setSelectedEffect;

		this.getSelectedEffect = function () {
			return selectedEffect;
		};

		this.getSelectedMediaObjectId = function () {
			return selectedMediaObjectId;
		};

		this.clearAllSelected = function () {
			if (selectedShape !== null){
				setSelectedShape(null);
			}

			if (selectedEffect !== null){
				setSelectedEffect(null, null);
			}
		};
	});
