'use strict';

angular.module('animatesPlayer')
	.controller('PlayerCtrl', function ToolbarPanelCtrl($scope, playerAnimationService, playerPresentationPlayerService, playerCanvasService, playerServerService, playerLocalAnimationStateService) {
		$scope.loading = true;
		$scope.errorMessage = undefined;
		$scope.maxTick = 5000;
		$scope.tick = 0;
		$scope.tickRatio = playerPresentationPlayerService.tickDuration();

		$scope.onTogglePlaying = function(playing) {
			if (playing) {
				playerPresentationPlayerService.play();
			} else {
				playerPresentationPlayerService.pause();
			}
		};

		function loadProject(animation) {
			if (animation !== undefined) {
				playerAnimationService.getInstance().loadProject(animation);
				playerCanvasService.createCanvas();
				playerLocalAnimationStateService.setCurrentTick(0);
				$scope.loading = false;
			}
		}

		$scope.initializeAnimation = function (projectId, project) {
			$scope.loading = true;

			if (projectId !== undefined) {
				playerServerService.loadProject(projectId, function success(data) {
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
			playerLocalAnimationStateService.setCurrentTick(tick);
		};

		$scope.onLocalStateTickChange = function(newVal) {
			if ($scope.tick !== newVal) {
				$scope.tick = newVal;

				if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
					$scope.$apply();
				}
			}
		};

		playerLocalAnimationStateService.addTickObserver('PlayerCtrl', $scope.onLocalStateTickChange);
	});
