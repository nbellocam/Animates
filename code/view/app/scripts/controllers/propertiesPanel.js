'use strict';

angular.module('animatesApp')
	.controller('PropertiesPanelCtrl', function PropertiesPanelCtrl($scope, $rootScope, $location, canvasService) {
		$scope.properties = null;

		$scope.empty = function () {
			var isEmpty = ($scope.properties === null);
			return isEmpty;
		};

		$rootScope.$on('selectedShapeChange', function (event, canvasShape){
			if (canvasShape === null) {
				$scope.properties = null;
			} else if (!canvasShape.isType('group')){
				$location.path('propertiesPanel');
				$scope.properties = canvasShape.model.properties();
			} else {
				//TODO complete logic for groups
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
					//TODO complete logic for groups
				}
			}
		});
	});
