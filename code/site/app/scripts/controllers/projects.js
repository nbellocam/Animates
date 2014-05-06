'use strict';

angular.module('animatesApp')
  .controller('ProjectsCtrl', function ($scope,  $rootScope, $routeParams, $location, ProjectService) {
	$scope.create = function() {
		var project = new ProjectService({
				title: this.title,
				description: this.description
			});

		project.$save(function(response) {
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
	};

	$scope.update = function() {
		var project = $scope.project;
		if (!project.updated) {
			project.updated = [];
		}
		
		ProjectService.updated.push(new Date().getTime());

		project.$update(function() {
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
			$scope.project = project;
		});
	};
});