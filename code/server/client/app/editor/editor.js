'use strict';

angular.module('animatesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/:id', {
        templateUrl: 'app/editor/editor.html',
        controller: 'EditorCtrl'
      });
  });
