'use strict';

angular.module('animatesApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
    $scope.waiting = false;

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        $scope.waiting = true;
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/projects');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        })
        .finally(function () {
          $scope.waiting = false;
        });
      }
    };
  });