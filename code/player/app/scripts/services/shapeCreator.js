'use strict';

angular.module('animatesPlayer')
	.service('playerShapeCreator', function playerShapeCreator(playerLocalAnimationStateService, playerShapeSync, playerShapeHelper) {
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

		this.createShapeFromFrame = function createShapeFromFrame(mediaFrame) {
			if (mediaFrame) {
				var type = mediaFrame.getMediaObjectType();

				if (isTypeRegistered(type)) {
					var shape = registeredShapes[type](mediaFrame.getMediaObjectGuid());

					shape.setOriginX('center');
					shape.setOriginY('center');

					playerShapeHelper.setModelInView(mediaFrame, shape);
					playerShapeSync.syncFromModel(shape);
					return shape;
				}
			}

			return undefined;
		};

		this.createShapeFromMediaTime = function createShapeFromMediaTime(mediaTimeline) {
			var shape = _self.createShapeFromFrame(
				mediaTimeline.getMediaFrameFor(playerLocalAnimationStateService.getCurrentTick()));

			shape.setOriginX('center');
			shape.setOriginY('center');

			return shape;
		};
	});
