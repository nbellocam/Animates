'use strict';

angular.module('animatesApp')
	.factory('shapeCreator', function shapeCreator(canvasService, shapeSync, $window) {
		var fabric = $window.fabric,
			model = $window.model,
			createRectangle = function createRectangle(){
				// TODO: we need to pass the model and fabric in the correct ways to angular.
				var rect = new fabric.Rect({
						left: 50,
						top: 50,
						fill: 'red',
						width: 70,
						height: 150
					});

				rect.model = new model.Rectangle();
				shapeSync.syncFromFabric(rect, canvasService.getCanvasPosition());
				return rect;
			};
		
		return {
			createRectangle : createRectangle
		};
	});
