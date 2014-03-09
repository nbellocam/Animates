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
			} else {
				$location.path('propertiesPanel');
				$scope.properties = canvasShape.model.properties();
			}
			$scope.$apply();
		});

		$rootScope.$on('shapeChange', function (event, canvasShape){
			if (canvasService.getSelectedShape().model.getMediaObjectGuid() === canvasShape.model.getMediaObjectGuid()) {
				$scope.properties = canvasService.getSelectedShape().model.properties();
				$scope.$apply();
			}
		});
	});
