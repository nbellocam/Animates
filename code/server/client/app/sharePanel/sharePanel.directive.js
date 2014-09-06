'use strict';

angular.module('animatesApp')
  .directive('sharePanel', function () {
    return {
      templateUrl: 'app/sharePanel/sharePanel.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        $http.get('/api/projects').success(function(projects) {
            $scope.projects = projects;
            socket.syncUpdates('project', $scope.projects, onSave);
        });
      }
    };
  });
