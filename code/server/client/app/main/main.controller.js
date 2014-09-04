'use strict';

angular.module('animatesApp')
  .controller('MainCtrl', function ($scope, $http, $location, socket) {
    $scope.projects = [];

    function onSave (event, item, array) {
      $scope.$apply(function () {
        array.sort(function(a, b){return a.modified < b.modified });
      });
    }

    $http.get('/api/projects').success(function(projects) {
      $scope.projects = projects;
      socket.syncUpdates('project', $scope.projects, onSave);
    });

    $scope.addProject = function() {
      if($scope.newProject === '') {
        return;
      }
      $http.post('/api/projects', { name: $scope.newProject }).success( function (project) {
        $location.path('/projects/' + project._id);
      });
      $scope.newProject = '';
    };

    $scope.deleteProject = function(project) {
      $http.delete('/api/projects/' + project._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('project');
    });
  });
