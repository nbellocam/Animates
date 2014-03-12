'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, $rootScope, $location, canvasService, timelineService) {
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
