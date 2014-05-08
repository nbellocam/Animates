'use strict';

angular.module('animatesApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'LocalStorageModule'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        authenticate: true
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/projects', {
        templateUrl: 'partials/projects/list',
        controller: 'ProjectsCtrl',
        authenticate: true
      })
      .when('/projects/create', {
        templateUrl: 'partials/projects/create',
        controller: 'ProjectsCtrl',
        authenticate: true
      })
      .when('/projects/:projectId/edit', {
        templateUrl: 'partials/projects/edit',
        controller: 'ProjectsCtrl',
        authenticate: true
      })
      .when('/projects/:projectId', {
        templateUrl: 'partials/projects/show',
        controller: 'ProjectsCtrl',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);

    localStorageServiceProvider.setPrefix('animates');
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });