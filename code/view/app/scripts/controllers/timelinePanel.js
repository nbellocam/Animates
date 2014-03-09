'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, $rootScope, $location, canvasService) {
		$scope.timelines = [{
			guid : 'timeline1',
			name : 'timeline1-name',
			events : [{
					name : 'animation1',
					start : 10,
					duration : 190,
					'class' : 'fade-out',
				},
				{
					name : 'animation2',
					start : 210,
					duration : 200,
					'class' : 'fade-in',
				}]
			}];

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
