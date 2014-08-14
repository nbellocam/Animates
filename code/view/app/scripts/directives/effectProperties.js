'use strict';

angular.module('animatesApp')
	.directive('animatesEffectproperties', function () {
		return {
			restrict: 'E',
			scope: {
				effectProperties: '=',
				updatehandler: '&'
			},
			template:
			'<table class="table table-striped">' +
				'<tr ng-repeat="key in basePropertiesKeys">' +
					'<td>{{ key }}</td>' +
					'<td>' +
						'<animates-Property propkey="key" prop="effectProperties.get(key)" updatehandler="onEffectUpdate(key, value)"></animates-Property>' +
					'</td>' +
				'</tr>' +
			'</table>' +
			'<h5>Points</h5>' +
			'<table class="table table-striped">' +
				'<tr>' +
					'<th ng-repeat="key in pointsHeaders">{{ key }}</th>' +
				'</tr>' +
				'<tr ng-repeat="point in points">' +
					'<td ng-repeat="pointData in point">' +
						'<animates-Property propkey="pointData" prop="effectProperties.get(pointData)" updatehandler="onEffectUpdate(key, value)"></animates-Property>' +
					'</td>' +
				'</tr>' +
			'</table>',
			controller: function($scope) {
				function adaptEffectProperties() {
					function getPointId(key) {
						return key.slice(7, key.indexOf('.', 7) - 1);
					}

					function getPropertyName(key) {
						return key.slice(key.indexOf('.', 7) + 1);
					}

					var names = $scope.effectProperties.names(),
						basePropertiesKeys = [],
						pointsHeaders = [],
						points = {},
						key, propertyName, id;

					for (var i = 0; i < names.length; i++) {
						key = names[i];
						if (key !== 'startTick' && key !== 'endTick') {
							if (key.indexOf('points.') !== 0) {
								basePropertiesKeys.push(key);
							} else {
								id = getPointId(key);
								propertyName = getPropertyName(key);

								if(pointsHeaders.indexOf(propertyName) === -1){
									pointsHeaders.push(propertyName);
								}

								if (!points[id]) {
									points[id] = {};
								}

								points[id][propertyName] = key;
							}
						}
					}

					$scope.basePropertiesKeys = basePropertiesKeys;
					$scope.pointsHeaders = pointsHeaders;
					$scope.points = points;
				}

				$scope.onEffectUpdate = function(key, value) {
					if ($scope.updatehandler) {
						$scope.updatehandler( { 'key' : key, 'value':  value });
					}
				};

				$scope.$watch('effectProperties', function() {
					if ($scope.effectProperties) {
						adaptEffectProperties();
					}
				});
			}
		};
	});
