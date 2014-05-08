'use strict';

angular.module('animatesApp')
  .controller('MainCtrl', function ($scope, localStorageService, recentProjectsService){
    $scope.recentProjects = recentProjectsService.retrieveAll().slice(0, 10);
  });