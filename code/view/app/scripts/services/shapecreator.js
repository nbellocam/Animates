'use strict';

angular.module('animatesApp')
	.factory('shapeCreator', function (shapeSync) {
		var createRectangle = function createRectangle(){
			// TODO: we need to pass the model and fabric in the correct ways to angular.
			var rect = new fabric.Rect({
					left: 50,
					top: 50,
					fill: 'red',
					width: 70,
					height: 150
				});

			rect.model = new model.Rectangle();
			shapeSync.syncFromFabric(rect);
			return rect;
		};
		
		return {
			createRectangle : createRectangle
		};
	});
