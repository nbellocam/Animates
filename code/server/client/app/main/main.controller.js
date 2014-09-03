'use strict';

angular.module('animatesApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.projects = [];

    $http.get('/api/projects').success(function(projects) {
      $scope.projects = projects;
      socket.syncUpdates('project', $scope.projects);
    });

    $scope.addProject = function() {
      if($scope.newProject === '') {
        return;
      }
      $http.post('/api/projects', { name: $scope.newProject });
      $scope.newProject = '';
    };

    $scope.deleteProject = function(project) {
      $http.delete('/api/projects/' + project._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('project');
    });
  });
