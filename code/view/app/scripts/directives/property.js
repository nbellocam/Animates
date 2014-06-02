'use strict';

angular.module('animatesApp')
	.directive('animatesProperty', function () {
		return {
			restrict: 'E',
			scope: {
				propkey: '=',
				prop: '=',
				updatehandler: '&'
			},
			template: '<input type="" minicolors value="{{ prop.value() }}" id="property.{{ propkey }}" class="property form-control" ng-blur="propertyBlur($event)"></input>',
			controller: function($scope) {
				$scope.isValid = true;
				$scope.propertyBlur = function (event) {
					var oldValue = $scope.prop.value(),
						newValue = event.target.value;
					
					//TODO controller should not be accesing the dom
					event.target.style.color = 'black';

					if (oldValue !== newValue) {
						if ($scope.prop.isValid(newValue)) {
							$scope.prop.parse(newValue);
							$scope.updatehandler( { 'key' : $scope.propkey, 'value':  $scope.prop.value() });
						} else {
							event.target.style.color = 'red';
						}
					}
				};
			},
			link : function (scope, element, attrs) {
				switch (scope.prop.type().name()) {
					case 'color':
						$(element.find('input')[0])
							.minicolors();
						$(element.find('input')[0])
							.minicolors('value', scope.prop.value());
						break;
					case 'integer':
						console.log('integer');
						element.find('input').attr('type', 'number');
						break;
					case 'float':
						console.log('float');
						element.find('input').attr('type', 'number');
						break;
				}
			}
		};
	});