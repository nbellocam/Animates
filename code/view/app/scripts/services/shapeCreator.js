'use strict';

angular.module('animatesApp')
	.factory('shapeCreator', function shapeCreator(animationService, localAnimationStateService, shapeSync, $window) {
		var Fabric = $window.fabric,
			createShapeFromFrame = function createShapeFromFrame(mediaFrame, canvasPosition) {
				if (mediaFrame) {
					var rect = new Fabric.Rect();

					rect.model = mediaFrame;
					shapeSync.syncFromModel(rect, canvasPosition);
					return rect;
				}

				return undefined;
			},
			createShapeFromMediaObject = function createShapeFromMediaObject(mediaObject, canvasPosition) {
				return createShapeFromFrame(
					animationService.getInstance().timeline.getMediaFrameFor(mediaObject.getGuid(), localAnimationStateService.getCurrentTick()),
					canvasPosition);
			};

		return {
			createShapeFromMediaObject : createShapeFromMediaObject,
			createShapeFromFrame : createShapeFromFrame
		};
	});
