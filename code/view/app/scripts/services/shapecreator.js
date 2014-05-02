'use strict';

angular.module('animatesApp')
	.factory('shapeCreator', function shapeCreator(canvasService, timelineService, shapeSync, $window) {
		var Fabric = $window.fabric,
			Model = $window.model,
			createRectangle = function createRectangle(){
				// TODO: we need to pass the model and fabric in the correct ways to angular.
				var rectModel = new Model.Rectangle({
						position: {
							x: 0,
							y: 0
						},
						fill: 'red',
						width: 70,
						height: 150
					}),
					mediaFrame = timelineService.addMediaObject(rectModel),
					rect = new Fabric.Rect();

				rect.model = mediaFrame;
				shapeSync.syncFromModel(rect, canvasService.getCanvasPosition());
				return rect;
			},
			createShapeFromFrame = function createShapeFromFrame(mediaFrame){
				//var rectModel = new Model.Rectangle(mediaFrame.properties()),
					//mediaFrame = timelineService.addMediaObject(rectModel),
				var rect = new Fabric.Rect();

				rect.model = mediaFrame;
				shapeSync.syncFromModel(rect, canvasService.getCanvasPosition());
				return rect;
			};
		return {
			createRectangle : createRectangle,
			createShapeFromFrame : createShapeFromFrame
		};
	});
