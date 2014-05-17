'use strict';

angular.module('animatesApp')
	.factory('shapeCreator', function shapeCreator(timelineService, shapeSync, $window) {
		var Fabric = $window.fabric,
			createShapeFromFrame = function createShapeFromFrame(mediaFrame, canvasPosition){
				//var rectModel = new Model.Rectangle(mediaFrame.properties()),
					//mediaFrame = timelineService.addMediaObject(rectModel),
				var rect = new Fabric.Rect();

				rect.model = mediaFrame;
				shapeSync.syncFromModel(rect, canvasPosition);
				return rect;
			},
			createShapeFromMediaObject = function createShapeFromMediaObject(mediaObject, canvasPosition){
				var mediaFrame = timelineService.getMediaFrame(mediaObject.getGuid());
				return mediaFrame ? createShapeFromFrame(mediaFrame, canvasPosition) : undefined;
			};
		return {
			createShapeFromMediaObject : createShapeFromMediaObject,
			createShapeFromFrame : createShapeFromFrame
		};
	});
