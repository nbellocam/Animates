'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Projects',
        'link': 'projects'
    }, {
        'title': 'Create New Project',
        'link': 'projects/create'
    }];
    
    $scope.isCollapsed = false;
}]);