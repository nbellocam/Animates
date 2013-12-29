'use strict';

angular.module('animates')
	.factory('shapeCreator', function () {
		var createRectangle = function createRectangle(){
				// TODO: we need to pass the model and fabric in the correct ways to angular.
				var rect = new fabric.Rect({
					 	left: 50, top: 50, fill: 'red', width: 70, height: 150
					});

				rect.model = new model.Rectangle();
				//TODO update the model with the same values that the fabric rect has.
				return rect;
			};
		
		return {
			createRectangle : createRectangle
		};
	});
