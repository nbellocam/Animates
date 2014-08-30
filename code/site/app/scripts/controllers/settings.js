'use strict';

angular.module('animatesApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.waiting = false;

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        $scope.message = '';
        $scope.errors.other = '';
        $scope.waiting = true;
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          form.$valid = false;
          $scope.errors.other = 'Incorrect password';
        })
        .finally(function () {
          $scope.waiting = false;
        });
      }
		};
  });
