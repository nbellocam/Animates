'use strict';

angular.module('animatesApp')
  .directive('project', function ($http, Modal) {
    return {
      templateUrl: 'app/project/project.html',
      restrict: 'E',
      scope: {
        project: '='
      },
      link: function (scope) {
        scope.titleChange = function (newValue) {
          console.log('new value: ' + newValue);
        };

        scope.share = function () {
          var modal = Modal.form.share();
          modal(scope.project.name);
        };

        scope.delete = function() {
          var modal = Modal.confirm.delete(function () {
            $http.delete('/api/projects/' + scope.project._id);
          });

          modal(scope.project.name);
        };
      }
    };
  });
