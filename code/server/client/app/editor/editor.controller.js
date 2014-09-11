'use strict';

angular.module('animatesApp')
  .controller('EditorViewCtrl', function ($scope, $http, socket, $routeParams, Modal) {
    $scope.project = undefined;
    $scope.socket = socket.socket;
    $scope.playUrl = '';
    $scope.isEditor = true;

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

    $scope.shareProject = function() {
        var modal = Modal.form.share(angular.noop, $scope.project._id);
        modal();
    };

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

    $http.get('/api/projects/' +  $routeParams.id).success(function(project) {
      project.id = project._id;
      $scope.project = project;
      $scope.playUrl = '/projects/' + project._id + '/play';
      $scope.$broadcast('projectLoaded', project);
    })
    .error(function() {
      var errorModal = Modal.alerts.error();
      errorModal();
    });

  });
