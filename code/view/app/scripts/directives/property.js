'use strict';

angular.module('animatesApp')
	.directive('animatesProperty', function ($window, $q) {
		var fileToDataURL = function (file) {
				var deferred = $q.defer();
				var reader = new FileReader();
				reader.onload = function (e) {
						deferred.resolve(e.target.result);
					};
				reader.readAsDataURL(file);
				return deferred.promise;
			},
			processImageFile = function (file, scope) {
				fileToDataURL(file).then(function (dataURL) {
					if (dataURL) {
						scope.prop.parse(dataURL);
						scope.updatehandler( { 'key' : scope.propkey, 'value':  scope.prop.value() });
					}
				});
			};

		return {
			restrict: 'E',
			scope: {
				propkey: '=',
				prop: '=',
				updatehandler: '&'
			},
			template:
				'<select ng-show="template() == \'select\'" id="property.{{ propkey }}" class="property form-control text" ng-blur="propertyBlur($event)">' +
					'<option ng-repeat="option in prop.strictValues();" ng-selected="prop.value() == option">{{option}}</option>'+
				'</select>' +
				'<textarea ng-show="template() == \'textarea\'" ng-rows="rows()" type="text" value="{{ prop.value() }}" id="property.{{ propkey }}" class="property form-control text" ng-blur="propertyBlur($event)"></textarea>' +
				'<input ng-show="template() == \'input\'" type="file" value="{{ getValue() }}" id="property.{{ propkey }}" class="property form-control" ng-blur="propertyBlur($event)"></input>',
			controller: function($scope) {
				$scope.isValid = true;
				$scope.rows = function () { return $scope.prop.value().split('\n').length; };
				$scope.template = function () {
					if ($scope.prop.isStrict()) {
						return 'select';
					} else if ($scope.prop.type().name() === 'text') {
						return 'textarea';
					} else {
						return 'input';
					}
				};

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

				$scope.getValue = function () {
					if($scope.prop.type().name() === 'imageFile') {
						return '';
					}

					return $scope.prop.value();
				};
			},
			link : function (scope, element) {
				var input;

				input = element.find(scope.template());

				scope.updateValue = function (value) {
					input.val((scope.prop.type().name() === 'imageFile') ? '' : value);
				};

				switch (scope.prop.type().name()) {
					case 'color':
						input.attr('type', '');
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
					case 'imageFile':
						//input.attr('type', 'file');
						input.attr('accept','image/*');
						input.on('change', function (evt) {
							var files = evt.target.files;
							for(var i = 0; i < files.length; i++) {
								processImageFile(files[i], scope);
							}
						});

						break;
					default:
						input.attr('type', '');
						break;

				}

				scope.$watch('prop.value()', function (newVal) {
					scope.updateValue(newVal);
				});
			}
		};
	});
