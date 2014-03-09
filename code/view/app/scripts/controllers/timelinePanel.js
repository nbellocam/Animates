'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, $rootScope, $location, canvasService, canvasUtils) {
		$scope.timelines = [
          {
            guid : 'timeline1',
            name : 'timeline1-name',
            events : 
              [
                { 
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
                }
              ]
          },
          {
            guid : 'timeline2',
            name : 'timeline2-name',
            events : 
              [
                { 
                  name : 'animation3',
                  start : 100,
                  duration : 100
                },
                { 
                  name : 'animation4',
                  start : 500,
                  duration : 450
                }
              ]
          },
          {
            guid : 'timeline3',
            name : 'timeline3-name',
            events : 
              [
                { 
                  name : 'animation4',
                  start : 150,
                  duration : 100
                },
                { 
                  name : 'animation5',
                  start : 500,
                  duration : 4500
                }
              ]
          },
          {
            guid : 'timeline4',
            name : 'timeline4-name',
            events : 
              [
                { 
                  name : 'animation6',
                  start : 150,
                  duration : 100
                },
                { 
                  name : 'animation7',
                  start : 500,
                  duration : 4500
                }
              ]
          }
        ];;

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
