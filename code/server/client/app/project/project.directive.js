'use strict';

angular.module('animatesApp')
  .directive('project', function ($http) {
    return {
      templateUrl: 'app/project/project.html',
      restrict: 'E',
      scope: {
        project: '='
      },
      link: function (scope, element, attrs) {
        scope.titleChange = function (newValue, oldValue) {
          console.log('new value: ' + newValue);
        };

        scope.delete = function() {
          $http.delete('/api/projects/' + scope.project._id);
        };
      }
    };
  });
