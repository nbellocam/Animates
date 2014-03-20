'use strict';

angular.module('animatesApp')
	.controller('ToolbarCtrl', function ToolbarCtrl($scope, shapeCreator, canvasService, canvasUtils, timelineService) {
		$scope.addRectangle = function() {
			canvasService.add(shapeCreator.createRectangle());
		};

		$scope.addCircle = function() {
			//alert('Circle still not available!');
		};

		$scope.addTriangle = function() {
			//alert('Triangle still not available!');
		};

		$scope.addStar = function() {
			//alert('Star still not available!');
		};

		$scope.addImage = function() {
			//alert('Image still not available!');
		};

		$scope.addText = function() {
			//alert('Text still not available!');
		};

		$scope.addSound = function() {
			//alert('Sound still not available!');
		};

		$scope.removeElements = function() {
			var selectedElement = canvasService.getSelectedShape();

			if (selectedElement){
				if (selectedElement.isType('group')){
					selectedElement.forEachObject(function (obj){
						canvasService.remove(obj);
						timelineService.removeMediaObject(obj.model.getMediaObjectGuid());
					});
					canvasService.getInstance().discardActiveGroup().renderAll();
				} else {
					selectedElement.remove();
					timelineService.removeMediaObject(selectedElement.model.getMediaObjectGuid());
				}
			}
		};
	});
