'use strict';

angular.module('animatesApp')
  .controller('PlayerViewCtrl', function ($scope, $http, socket, $routeParams, Modal) {
    $scope.project = undefined;
    $scope.projectId = undefined;

    $http.get('/api/projects/' + $routeParams.id + '/play').success(function(project) {
      project.id = project._id;
      $scope.project = project;
      $scope.projectId = project._id;
      $scope.$broadcast('projectLoaded', project);
    });

    $scope.downloadProject = function() {
        $http.get('/api/projects/' + $scope.project._id + '/download', {responseType: 'arraybuffer'})
          .success(function(projectZip) {
            var hiddenElement = document.createElement('a');
            hiddenElement.setAttribute('id', 'hiddenDownloadElement');
            var blob = new Blob([projectZip], {type: 'application/zip'});
            hiddenElement.href = window.URL.createObjectURL(blob);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'animation.zip';
            hiddenElement.click();
          })
          .error(function () {
            var errorModal = Modal.alerts.error();
            errorModal();
          });
    };
  });
