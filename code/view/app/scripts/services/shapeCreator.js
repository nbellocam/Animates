'use strict';

angular.module('animatesApp')
	.service('shapeCreator', function shapeCreator(animationService, localAnimationStateService, shapeSync, shapeHelper) {
		var registeredShapes = {},
			_self = this;

		function isTypeRegistered(type) {
			return type && registeredShapes[type] && (typeof(registeredShapes[type]) === 'function');
		}

		this.registerShape = function registerShape(type, creationFunction) {
			if (type && !isTypeRegistered(type) && (typeof(creationFunction) === 'function')) {
				registeredShapes[type] = creationFunction;
			}
		};

		this.createShapeFromFrame = function createShapeFromFrame(mediaFrame, canvasPosition) {
			if (mediaFrame) {
				var type = mediaFrame.getMediaObjectType();

				if (isTypeRegistered(type)) {
					var shape = registeredShapes[type]();
					shapeHelper.setModelInView(mediaFrame, shape);
					shapeSync.syncFromModel(shape, canvasPosition);
					return shape;
				}
			}

			return undefined;
		};

		this.createShapeFromMediaObject = function createShapeFromMediaObject(mediaObject, canvasPosition) {
			return _self.createShapeFromFrame(
				animationService.getInstance().timeline.getMediaFrameFor(mediaObject.getGuid(), localAnimationStateService.getCurrentTick()),
				canvasPosition);
		};
	});
