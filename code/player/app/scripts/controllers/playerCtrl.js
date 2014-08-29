'use strict';

angular.module('animatesApp')
	.controller('PlayerCtrl', function ToolbarPanelCtrl($scope, animationService, presentationPlayerService) {
		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.playing = !animationService.isEditingEnable;
			});

		// Other methods

		$scope.play = function () {
			presentationPlayerService.play();
		};

		$scope.pause = function () {
			presentationPlayerService.pause();
		};

		$scope.stop = function () {
			presentationPlayerService.stop();
		};

		$scope.stepForward = function () {
			presentationPlayerService.stepForward(50);
		};

		$scope.stepBackward = function () {
			presentationPlayerService.stepBackward(50);
		};
	});
