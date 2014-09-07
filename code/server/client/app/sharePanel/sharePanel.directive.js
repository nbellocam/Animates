'use strict';

angular.module('animatesApp')
  .directive('sharePanel', function ($http, $location, Modal) {
    return {
      templateUrl: 'app/sharePanel/sharePanel.html',
      restrict: 'E',
      link: function (scope, element) {
        scope.newCollaborator = '';
        scope.url = '';
        scope.public = false;
        scope.collaborators = [];
        scope.options = [
          {
            text : 'Play',
            value : 'play'
          },
          {
            text : 'Edit',
            value : 'edit'
          }
        ];
        scope.newCollaboratorPermission = scope.options[0];

        scope.extendOne = function (c) {
          c.extendedPermission = {
            text : c.permission,
            value : c.permission
          };
        };

        scope.extend = function (colab) {
          for (var x=0; x < colab.length; x++) {
              scope.extendOne(colab[x]);
          }
        };

        scope.newCollaboratorPermission = scope.options[0];

        scope.addCollaborator = function () {
          var data = {
            email : scope.newCollaborator,
            permission : scope.newCollaboratorPermission.value
          };

          $http({
            method: 'PUT',
            url: '/api/projects/' + scope.projectId + '/collaborators',
            data : data
          })
          .success(function(collaborator) {
            var found = false;

            for (var x=0; x < scope.collaborators.length; x++) {
                if (scope.collaborators[x].user._id.toString() === collaborator.user._id.toString()) {
                  scope.extendOne(collaborator);
                  scope.collaborators[x] = collaborator;
                  found = true;
                  break;
                }
            }

            if (!found) {
              scope.extendOne(collaborator);
              scope.collaborators.push(collaborator);
            }

            scope.newCollaborator = '';
            scope.newCollaboratorPermission = scope.options[0];
          })
          .error(function() {
            var errorModal = Modal.alerts.error();
            errorModal();
          });
        };

        scope.removeCollaborator = function (index) {
          var item = scope.collaborators[index];
          $http({
            method: 'DELETE',
            url: '/api/projects/' + scope.projectId + '/collaborators/'+ item.user._id,
          })
          .success(function() {
            scope.collaborators.slice(index, 1);
            angular.element(element[0].querySelector('[rel="' + item.user._id + '"]')).remove();
          })
          .error(function() {
            var errorModal = Modal.alerts.error();
            errorModal();
          });
        };

        scope.changePermission = function (index) {
          var item = scope.collaborators[index];
          var data = {
            permission : item.extendedPermission.value
          };

          $http({
            method: 'PUT',
            url: '/api/projects/' + scope.projectId + '/collaborators/' + item.user._id,
            data : data
          })
          .success(function (collab){
            scope.extendOne(collab);
            scope.collaborators[index] = collab;
          })
          .error(function() {
            var errorModal = Modal.alerts.error();
            errorModal();
          });

        };

        scope.makePublic = function () {
          var jsonPatch = { public : scope.project.public };

          $http({
            method: 'PATCH',
            url: '/api/projects/' + scope.projectId,
            data : jsonPatch
          })
          .success(function(project) {
            scope.public = project.public;
          })
          .error(function() {
            var errorModal = Modal.alerts.error();
            errorModal();
          });
        };

        $http.get('/api/projects/' + scope.projectId).success(function(project) {
              scope.project = project;
              scope.url = $location.absUrl() + 'projects/' +  project._id;
              scope.collaborators = project.workgroup;
              scope.extend(project.workgroup);
        }).
        error(function () {
            var errorModal = Modal.alerts.error();
            errorModal();
        });
      }
    };
  });
