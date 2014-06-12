/*global $*/
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
			template: '<input type="" value="{{ prop.value() }}" id="property.{{ propkey }}" class="property form-control" ng-blur="propertyBlur($event)"></input>',
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
			link : function (scope, element) {

				scope.updateValue = function (value) {
					element.find('input').val(value);
				}

				switch (scope.prop.type().name()) {
					case 'color':
						$(element.find('input')[0])
							.minicolors();
						$(element.find('input')[0])
							.minicolors('value', scope.prop.value());
						
						scope.updateValue = function (newVal) {
							$(element.find('input')[0])
								.minicolors('value', newVal);
						}
						break;
					case 'integer':
						element.find('input').attr('type', 'number');
						break;
					case 'float':
						element.find('input').attr('type', 'number');
						break;
				}

				scope.$watch('prop.value()', function (newVal) {
					scope.updateValue(newVal);
				});
			}
		};
	});