'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, $rootScope, $location, canvasService, canvasUtils) {
		$scope.timelines = null;

		$scope.empty = function () {
			var isEmpty = ($scope.properties === null);
			return isEmpty;
		};

		$rootScope.$on('selectedShapeChange', function (event, canvasShape){
			if (canvasShape === null) {
				$scope.properties = null;
			} else {
				$scope.properties = canvasShape.model.getProperties();
			}
			$scope.$apply();
		});

		$rootScope.$on('shapeChange', function (event, canvasShape){
			if (canvasService.getSelectedShape().model.getGuid() === canvasShape.model.getGuid()) {
				$scope.properties = canvasService.getSelectedShape().model.getProperties();
				$scope.$apply();
			}
		});
	});
