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
          var jsonPatch = { name : newValue };

          $http({
            method: 'PATCH',
            url: '/api/projects/' + scope.project._id,
            data : jsonPatch
          })
          .success(function(project) {
            scope.project = project;
          })
          .error(function() {
            var errorModal = Modal.alerts.error();
            errorModal();
          });
        };

        scope.share = function () {
          var modal = Modal.form.share(angular.noop, scope.project._id);
          modal();
        };

        scope.delete = function() {
          var deleteConfirm = Modal.confirm.delete(function () {
            $http.delete('/api/projects/' + scope.project._id)
              .error(function () {
                var errorModal = Modal.alerts.error();
                errorModal();
              });
          });

          deleteConfirm(scope.project.name);
        };
      }
    };
  });
