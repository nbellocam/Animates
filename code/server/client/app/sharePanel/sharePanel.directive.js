'use strict';

angular.module('animatesApp')
  .directive('sharePanel', function ($http, $location) {
    return {
      templateUrl: 'app/sharePanel/sharePanel.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.newCollaborator = '';
        scope.newCollaboratorPermission = 'play';
        scope.url = '';
        scope.public = false
        scope.collaborators = [];

        scope.addCollaborator = function () {
          console.log(scope.newCollaborator);
          console.log(scope.newCollaboratorPermission);
        };

        scope.makePublic = function () {
          var jsonPatch = { public : scope.public };

          $http({
            method: 'PATCH',
            url: '/api/projects/' + scope.projectId,
            data : jsonPatch
          })
          .success(function(project) {
            scope.public = project.public;
          })
          .error(function(data, status, headers, config) {
            var errorModal = Modal.alerts.error();
            errorModal();
          });
        };

        $http.get('/api/projects/' + scope.projectId).success(function(project) {
              scope.project = project;
              scope.url = $location.absUrl() + 'projects/' +  project._id;
              scope.public = project.public;
              scope.collaborators = project.workgroup;
        }).
        error(function () {
            var errorModal = Modal.alerts.error();
            errorModal();
        });
      }
    };
  });
