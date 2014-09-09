'use strict';

angular.module('animatesApp')
  .controller('EditorViewCtrl', function ($scope, $http, socket, $routeParams, Modal) {
    $scope.project = undefined;
    $scope.socket = socket.socket;

    $scope.titleChange = function (newValue) {
      var jsonPatch = { name : newValue };

      $http({
        method: 'PATCH',
        url: '/api/projects/' + $scope.project._id,
        data : jsonPatch
      })
      .success(function(project) {
        $scope.project = project;
      })
      .error(function() {
        var errorModal = Modal.alerts.error();
        errorModal();
      });
    };

    $http.get('/api/projects/' +  $routeParams.id).success(function(project) {
      project.id = project._id;
      $scope.project = project;
      $scope.$broadcast('projectLoaded', project);
    })
    .error(function() {
      var errorModal = Modal.alerts.error();
      errorModal();
    });

  });
