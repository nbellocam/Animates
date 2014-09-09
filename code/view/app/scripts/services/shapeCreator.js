'use strict';

angular.module('animatesEditor')
	.service('shapeCreator', function shapeCreator(animationService, localAnimationStateService, shapeSync, shapeHelper) {
		var registeredShapes = {},
			_self = this;

		function isTypeRegistered(type) {
			return type && registeredShapes[type.trim()] && (typeof(registeredShapes[type.trim()]) === 'function');
		}

		this.registerShape = function registerShape(type, creationFunction) {
			if (type && !isTypeRegistered(type.trim()) && (typeof(creationFunction) === 'function')) {
				registeredShapes[type.trim()] = creationFunction;
			}
		};

		this.createShapeFromFrame = function createShapeFromFrame(mediaFrame, canvasPosition) {
			if (mediaFrame) {
				var type = mediaFrame.getMediaObjectType().trim();

				if (isTypeRegistered(type)) {
					var shape = registeredShapes[type](mediaFrame.getMediaObjectGuid());

					shape.setOriginX('center');
					shape.setOriginY('center');

					shapeHelper.setModelInView(mediaFrame, shape);
					shapeSync.syncFromModel(shape, canvasPosition);
					return shape;
				}
			}

			return undefined;
		};

		this.createShapeFromMediaTime = function createShapeFromMediaTime(mediaTimeline, canvasPosition) {
			var shape = _self.createShapeFromFrame(
				mediaTimeline.getMediaFrameFor(localAnimationStateService.getCurrentTick()),
				canvasPosition);

			shape.setOriginX('center');
			shape.setOriginY('center');

			return shape;
		};
	});
