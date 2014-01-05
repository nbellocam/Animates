'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function($scope, shapeCreator, currentCanvas, shapeSync) {
		var canvas = new fabric.Canvas('mainCanvas');
		currentCanvas.instance = canvas;

		$scope.initialize = function() {
			canvas.setHeight(500);
			canvas.setWidth(800);

			canvas.on('object:modified', function(options) {
				if (options.target) {
					//console.log('an object was clicked! ', options.target.type);
					shapeSync.syncFromFabric(options.target);
					//TODO work with the diff that is returned by the shapeSync.syncFromFabric method.
				}
			});

			var rect = shapeCreator.createRectangle();
			canvas.add(rect);

			rect.set('angle', 45);
			canvas.renderAll();
		}
	}); 