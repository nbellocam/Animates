'use strict';

angular.module('animatesApp')
	.factory('shapeCreator', function shapeCreator(canvasService, timelineService, shapeSync, $window) {
		var fabric = $window.fabric,
			model = $window.model,
			createRectangle = function createRectangle(){
				// TODO: we need to pass the model and fabric in the correct ways to angular.
				var rectModel = new model.Rectangle({
						position: {
							x: 0,
							y: 0
						},
						fill: 'red',
						width: 70,
						height: 150
					}),
					mediaFrame = timelineService.addMediaObject(rectModel),
					rect = new fabric.Rect();

				rect.model = mediaFrame;
				shapeSync.syncFromModel(rect, canvasService.getCanvasPosition());
				return rect;
			};
		
		return {
			createRectangle : createRectangle
		};
	});
