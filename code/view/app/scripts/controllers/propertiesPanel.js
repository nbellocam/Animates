'use strict';

angular.module('animatesApp')
	.controller('PropertiesPanelCtrl', function PropertiesPanelCtrl($scope, $rootScope, $location, canvasService) {
		$scope.properties = null;

		$scope.empty = function () {
			var isEmpty = ($scope.properties === null);
			return isEmpty;
		};

		var createGroupProperties = function createGroupProperties(fabricGroup){
			var canvasPosition = canvasService.getCanvasPosition();
			return {
				'# of items in group': fabricGroup.size(),
				'Group angle': fabricGroup.getAngle(),
				'Group x position': fabricGroup.left - canvasPosition.left,
				'Group y position': fabricGroup.top - canvasPosition.top,
			};
		};

		$rootScope.$on('selectedShapeChange', function (event, canvasShape){
			if (canvasShape === null) {
				$scope.properties = null;
			} else if (!canvasShape.isType('group')){
				$location.path('propertiesPanel');
				$scope.properties = canvasShape.model.properties();
			} else {
				$location.path('propertiesPanel');
				$scope.properties = createGroupProperties(canvasShape);
			}

			$scope.$apply();
		});

		$rootScope.$on('shapeChange', function (event, canvasShape){
			var selectedShapes = canvasService.getSelectedShape();

			if (selectedShapes !== null) {
				if (!selectedShapes.isType('group') && !canvasShape.isType('group')){
					if (selectedShapes.model.getMediaObjectGuid() === canvasShape.model.getMediaObjectGuid()) {
						$scope.properties = selectedShapes.model.properties();
						$scope.$apply();
					}
				} else {
					$scope.properties = createGroupProperties(canvasShape);
					$scope.$apply();
				}
			}
		});
	});
