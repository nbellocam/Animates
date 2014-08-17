'use strict';

angular.module('animatesApp')
	.directive('animatesEffectproperties', function () {
		return {
			restrict: 'E',
			scope: {
				effectProperties: '=',
				effectName: '=',
				updatehandler: '&'
			},
			template:
			'<table class="table table-striped">' +
				'<tr>' +
					'<td>Type</td>' +
					'<td>{{ effectName }}</td>' +
				'</tr>' +
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
					'<td ng-repeat="pointData in point.data">' +
						'<span ng-if="firstTick(pointData)">0</span>' +
						'<animates-Property ng-if="!firstTick(pointData)" propkey="pointData" prop="effectProperties.get(pointData)" updatehandler="onEffectUpdate(key, value)"></animates-Property>' +
					'</td>' +
				'</tr>' +
			'</table>',
			controller: function($scope) {
				function getPointId(key) {
					return key.slice(7, key.indexOf('.', 7) - 1);
				}

				function getPropertyName(key) {
					return key.slice(key.indexOf('.', 7) + 1);
				}

				function adaptEffectProperties() {
					var names = $scope.effectProperties.names(),
						basePropertiesKeys = [],
						pointsHeaders = ['tick'],
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

					var pointsArray = [],
						pointData, currentPoint;

					for(var point in points) {
						pointData = [];
						currentPoint = points[point];

						for (var j = 0; j < pointsHeaders.length; j++) {
							pointData.push(currentPoint[pointsHeaders[j]]);
						}

						pointsArray.push({
							data: pointData,
							tick: $scope.effectProperties.get(currentPoint.tick).value()
						});
					}

					pointsArray.sort(function(a, b) {
						return a.tick - b.tick;
					});

					$scope.basePropertiesKeys = basePropertiesKeys;
					$scope.pointsHeaders = pointsHeaders;
					$scope.points = pointsArray;
				}

				$scope.firstTick = function(pointData) {
					return (getPropertyName(pointData) === 'tick' && $scope.effectProperties.get(pointData).value() === 0);
				};

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
