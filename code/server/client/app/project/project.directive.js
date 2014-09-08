'use strict';

angular.module('animatesApp')
  .directive('project', function ($http, Modal, Auth) {
    return {
      templateUrl: 'app/project/project.html',
      restrict: 'E',
      scope: {
        project: '='
      },
      link: function (scope) {

        scope.hasPrivilege = function (p) {
          var user = Auth.getCurrentUser();

          if (user._id === scope.project.user._id) {
            return true;
          }

          var wks = scope.project.workgroup;

          for (var x = 0; x < scope.project.workgroup.length; x++ ) {
            if (user._id === wks[x].user) {
              if (wks[x].permission === p) {
                  return true;
              }
            }
          }

          return false;
        };

        function buildDefaultLink () {
            if (scope.hasPrivilege('edit')) {
              return '/projects/' + scope.project._id;
            } else {
              return '/projects/' + scope.project._id + '/play';
            }
        }

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

        scope.defaultLink = buildDefaultLink();
        scope.titleEnabled = scope.hasPrivilege('edit');
        scope.deleteEnabled = scope.hasPrivilege('delete');
        scope.shareEnabled = scope.hasPrivilege('editCollaborator');
      }
    };
  });
