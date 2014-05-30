'use strict';

angular.module('animatesApp')
	.directive('animatesProperty', function () {
		return {
			restrict: 'E',
			scope: {
				propkey: '=',
				prop: '='
			},
			template: '<input type="" value="{{ prop.value() }}" id="property.{{ propkey }}" ng-blur="propertyBlur($event)"></input>',
			controller: function($scope) {
				$scope.isValid = true;
				$scope.propertyBlur = function (event) {
					var oldValue = $scope.prop.value(),
						newValue = event.target.value;
					
					//TODO controller should not be accesing the dom
					event.target.style.color = 'black';

					if (oldValue !== newValue) {
						if ($scope.prop.isValid(newValue)) {
						} else {
							event.target.style.color = 'red';
						}
					}
				};
			}
		};
	});