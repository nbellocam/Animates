'use strict';

angular.module('animatesApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if ($scope.user.password !== $scope.user.confirmPassword) {
        form.confirmPassword.$setValidity('local', false);
        $scope.errors.confirmPassword = 'Passwords do not match';
      } else {
        form.confirmPassword.$setValidity('local', true);
        $scope.errors.confirmPassword = '';
      }

      angular.forEach($scope.user, function(propertyValue, propertyName) {
        form[propertyName].$setValidity('mongoose', true);
      });

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword,
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err, function(error) {
            form[error.param].$setValidity('mongoose', false);
            $scope.errors[error.param] = error.msg;
          });
        });
      }
    };
  });
