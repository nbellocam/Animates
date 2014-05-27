'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function CanvasCtrl($scope, canvasService, timelineService, shapeCreator, animationService) {
		function onAnimationLoad() {
			$scope.$watch(function () {
				return timelineService.getCurrentTick();
			},
			function currentTickChanged() {
				var frames = timelineService.getMediaFrames();
				canvasService.clear();
				angular.forEach(frames, function (frame) {
					canvasService.add(shapeCreator.createShapeFromFrame(frame, canvasService.getCanvasPosition()));
				});
			});
		}

		animationService.getInstance().addLoadCompleteObserver('CanvasCtrl', onAnimationLoad);
	});