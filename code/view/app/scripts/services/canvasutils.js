'use strict';

angular.module('animatesApp')
	.factory('canvasUtils', function (canvasService) {
		var applyToActiveElements = function applyToActiveElements(activeElementFunction){
			var canvas = canvasService.getInstance();

			if (canvas){
				var allObjects = canvas.getObjects(),
					j, object, objects;

				for (var i = 0; i < allObjects.length; i++) {
					object = allObjects[i];
					if (object.active) {
						if (object.group) {
							objects = object.group.objects;
							for (j = objects.length - 1; j >= 0; j--) {
								activeElementFunction(objects[j]);
							}
						} else {
							activeElementFunction(object);
						}
					}
				}
			}
		};
		
		return {
			applyToActiveElements : applyToActiveElements
		};
	});
