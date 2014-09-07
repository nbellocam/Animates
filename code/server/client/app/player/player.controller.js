'use strict';

angular.module('animatesApp')
  .controller('PlayerViewCtrl', function ($scope, $http, socket, $routeParams) {
    $scope.project = undefined;
    $scope.projectId = undefined;

    $http.get('/api/projects/' + $routeParams.id).success(function(project) {
      project.id = project._id;
      $scope.project = project;
      $scope.projectId = project._id;
      $scope.$broadcast('projectLoaded', project);
    });
  });
