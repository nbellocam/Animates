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
			template:
				'<textarea ng-show="isText()" rows="{{ rows() }}" type="text" value="{{ prop.value() }}" id="property.{{ propkey }}" class="property form-control text" ng-blur="propertyBlur($event)"></textarea>' +
				'<input ng-show="!isText()" type="" value="{{ prop.value() }}" id="property.{{ propkey }}" class="property form-control" ng-blur="propertyBlur($event)"></input>',
			controller: function($scope) {
				$scope.isValid = true;
				$scope.isText = function () { return $scope.prop.type().name() === 'text'; };
				$scope.rows = function () { return $scope.prop.value().split('\n').length; };

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
				var input;

				if (scope.isText()) {
					input = element.find('textarea');
				} else {
					input = element.find('input');
				}

				scope.updateValue = function (value) {
					input.val(value);
				};

				switch (scope.prop.type().name()) {
					case 'color':
						input.minicolors();
						input.minicolors('value', scope.prop.value());
						
						scope.updateValue = function (newVal) {
							input.minicolors('value', newVal);
						};
						break;
					case 'integer':
						input.attr('type', 'number');
						break;
					case 'float':
						input.attr('type', 'number');
						break;

				}

				scope.$watch('prop.value()', function (newVal) {
					scope.updateValue(newVal);
				});
			}
		};
	});