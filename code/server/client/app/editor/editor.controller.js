'use strict';

angular.module('animatesApp')
  .controller('EditorViewCtrl', function ($scope, $http, socket, $routeParams) {
    $scope.project = undefined;
    $scope.socket = socket.socket;

    $http.get('/api/projects/' +  $routeParams.id).success(function(project) {
      project.id = project._id;
      $scope.project = project;
      $scope.$broadcast('projectLoaded', project);
    });
  });
