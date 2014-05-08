'use strict';

angular.module('animatesApp')
  .controller('ProjectsCtrl', function ($scope, $rootScope, $routeParams, $location, ProjectService, recentProjectsService) {
    $scope.create = function() {
      var project = new ProjectService({
        title: this.title,
        description: this.description
      });

      project.$save(function(response) {
        recentProjectsService.updateRecentProjectList(project.title, response._id);
        $location.path('projects/' + response._id);
      });

      this.title = '';
      this.content = '';
    };

    $scope.remove = function(project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      }
      else {
        $scope.project.$remove();
        $location.path('projects');
      }

      recentProjectsService.removeFromRecentProjectList(project._id);
    };

    $scope.update = function() {
      var project = $scope.project;
      if (!project.updated) {
        project.updated = [];
      }
      
      ProjectService.updated.push(new Date().getTime());

      project.$update(function() {
        recentProjectsService.updateRecentProjectList(project.title, project._id);
        $location.path('projects/' + project._id);
      });
    };

    $scope.find = function() {
      ProjectService.query(function(projects) {
        $scope.projects = projects;
      });
    };

    $scope.findOne = function() {
      ProjectService.get({
        projectId: $routeParams.projectId
      }, function(project) {
        recentProjectsService.updateRecentProjectList(project.title, project._id);
        $scope.project = project;
      });
    };
  });