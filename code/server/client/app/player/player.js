'use strict';

angular.module('animatesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/:id/play', {
        templateUrl: 'app/player/player.html',
        controller: 'PlayerViewCtrl'
      });
  });
