'use strict';

angular.module('animatesApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Settings',
      'link': '/settings',
      'requireAuth' : true
    }, {
      'title': 'Projects',
      'link': '/projects',
      'requireAuth' : true
    }];
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.isVisible = function(item, currentUser){
      return (item.requireAuth) ? !!currentUser : true;
    };
  });
