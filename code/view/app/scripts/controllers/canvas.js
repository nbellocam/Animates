'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function($scope, shapeCreator, currentCanvas, shapeSync) {
		var createCanvas = function createCanvas(id) {
				var canvas = new fabric.Canvas(id);
				canvas.model = new model.Canvas();
				// Update Properties

				canvas.on('object:modified', function(options) {
					if (options.target) {
						//console.log('an object was clicked! ', options.target.type);
						shapeSync.syncFromFabric(options.target);
						//TODO work with the diff that is returned by the shapeSync.syncFromFabric method.
					}
				});

				return canvas;
			},
			canvas = createCanvas('mainCanvas');
		
		currentCanvas.instance = canvas;

		$scope.initialize = function() {

			//TODO create helper functions to set the canvas properties.
			canvas.setHeight(500);
			canvas.model.height = 500;

			canvas.setWidth(800);
			canvas.model.width = 800;

			var rect = shapeCreator.createRectangle();
			canvas.add(rect);

			rect.set('angle', 45);
			canvas.renderAll();
		};
	});