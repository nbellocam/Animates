'use strict';

angular.module('animatesApp')
  .controller('EditorCtrl', function ($scope, $http, socket, $routeParams) {
    $scope.project = null;

    $http.get('/api/projects/' +  $routeParams.id).success(function(project) {
      $scope.project = project;
    });
  });
