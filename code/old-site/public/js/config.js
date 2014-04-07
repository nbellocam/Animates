'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/projects', {
            templateUrl: 'views/projects/list.html'
        }).
        when('/projects/create', {
            templateUrl: 'views/projects/create.html'
        }).
        when('/projects/:projectId/edit', {
            templateUrl: 'views/projects/edit.html'
        }).
        when('/projects/:projectId', {
            templateUrl: 'views/projects/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);