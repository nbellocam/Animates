'use strict';

angular.module('animatesApp')
  .controller('EditorCtrl', function ($scope, $http, socket, $routeParams) {
    $scope.project = null;

    function onSave (event, item) {
       $scope.project.name = item.name;
    }

    $http.get('/api/projects/' +  $routeParams.id).success(function(project) {
      $scope.project = project;
      socket.syncUpdates('project', $scope.projects, onSave );
    });
  });
