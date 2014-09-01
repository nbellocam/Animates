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

		function initializeLayout() {
			angular.element(document).ready(function () {
				
			});
		}

		$scope.initializeAnimation = function (id) {
			$scope.loading = true;

			serverService.loadProject(id, function success(data) {
					animationService.getInstance().loadProject(data.animation);
					canvasService.createCanvas();
					initializeLayout();
					localAnimationStateService.setCurrentTick(0);
					$scope.loading = false;
				}, function error(data) {
					console.log('Error: ' + data);
					$scope.errorMessage = data || 'An error occurs.';
					$scope.loading = false;
				});
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
