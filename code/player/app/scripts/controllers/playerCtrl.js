'use strict';

angular.module('animatesPlayer')
	.controller('PlayerCtrl', function ToolbarPanelCtrl($scope, animationService, presentationPlayerService, canvasService, serverService, localAnimationStateService) {
		$scope.loading = true;
		$scope.errorMessage = undefined;
		$scope.maxTick = 5000;
		$scope.tick = 0;
		$scope.tickRatio = presentationPlayerService.tickDuration();

		$scope.onTogglePlaying = function(playing) {
			if (playing) {
				presentationPlayerService.play();
			} else {
				presentationPlayerService.pause();
			}
		};

		function loadProject(animation) {
			if (animation !== undefined) {
				animationService.getInstance().loadProject(animation);
				canvasService.createCanvas();
				localAnimationStateService.setCurrentTick(0);
				$scope.loading = false;
			}
		}

		$scope.initializeAnimation = function (projectId, project) {
			$scope.loading = true;

			if (projectId !== undefined) {
				serverService.loadProject(projectId, function success(data) {
						loadProject(data.animation);
					}, function error(data) {
						console.log('Error: ' + data);
						$scope.errorMessage = data || 'An error occurs.';
						$scope.loading = false;
					});
			} else {
				if (project !== undefined) {
					loadProject(project.animation);
				} else {
					$scope.$on('projectLoaded', function (event, project) {
						loadProject(project.animation);
					});
				}
			}
		};

		$scope.onTimelineTickChange = function(tick) {
			localAnimationStateService.setCurrentTick(tick);
		};

		$scope.onLocalStateTickChange = function(newVal) {
			if ($scope.tick !== newVal) {
				$scope.tick = newVal;

				if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
					$scope.$apply();
				}
			}
		};

		localAnimationStateService.addTickObserver('PlayerCtrl', $scope.onLocalStateTickChange);
	});
