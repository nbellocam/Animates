'use strict';

angular.module('animatesApp')
	.controller('PropertiesPanelCtrl', function PropertiesPanelCtrl($scope, $rootScope, $location, canvasService) {
		$scope.properties = null;

		$scope.empty = function () {
			var isEmpty = ($scope.properties === null);
			return isEmpty;
		};

		$rootScope.$on('selectedShapeChange', function (event, canvasShapes){
			if (canvasShapes === null) {
				$scope.properties = null;
			} else if (canvasShapes.length === 1){
				$location.path('propertiesPanel');
				$scope.properties = canvasShapes[0].model.properties();
			} else {
				//TODO complete logic for groups
			}

			$scope.$apply();
		});

		$rootScope.$on('shapeChange', function (event, canvasShapes){
			var selectedShapes = canvasService.getSelectedShapes();

			if (selectedShapes !== null) {
				if (selectedShapes.length === 1 && canvasShapes.length === 1){
					if (selectedShapes[0].model.getMediaObjectGuid() === canvasShapes[0].model.getMediaObjectGuid()) {
						$scope.properties = selectedShapes[0].model.properties();
						$scope.$apply();
					}
				} else {
					//TODO complete logic for groups
				}
			}
		});
	});
