'use strict';

angular.module('animatesApp')
  .controller('EditorViewCtrl', function ($scope, $http, socket, $routeParams) {
    $scope.project = null;
    $scope.socket = socket.socket;

    $http.get('/api/projects/' +  $routeParams.id).success(function(project) {
      $scope.project = project;
    });
  });
