'use strict';

angular.module('animatesApp')
  .directive('editable', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            onChange: '='
        },
        template: '<span asd asd ng-click="edit()" ng-show="!editing" ng-bind="value"></span><input ng-show="editing" ng-blur="stopEdit()" ng-keypress="keypress($event)" ng-model="value"></input>',
        link: function ($scope, element) {

            // Let's get a reference to the input element, as we'll want to reference it.
            var inputElement = angular.element(element.children()[1]);

            // Initially, we're not editing.
            $scope.editing = false;

            $scope.oldValue = $scope.value;

            $scope.keypress = function ($event) {
              if ($event.keyCode === 13) {
                $scope.stopEdit();
                if ($scope.value !== $scope.oldValue) {
                  $scope.onChange($scope.value, $scope.oldValue);
                }
              }
            };

            // ng-click handler to activate edit-in-place
            $scope.edit = function () {
                $scope.editing = true;

                // We control display through a class on the directive itself. See the CSS.
                element.addClass('active');

                // And we must focus the element.
                // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                // we have to reference the first element in the array.
                $timeout(function () { inputElement[0].focus(); });
            };

            $scope.stopEdit = function () {
              $scope.editing = false;
              element.removeClass('active');
            };
        }
    };
  });
