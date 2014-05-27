'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function CanvasCtrl($scope, canvasService, localAnimationStateService, shapeCreator, animationService) {
		function onAnimationLoad() {
			$scope.$watch(function () {
					return localAnimationStateService.getCurrentTick();
				},
				function currentTickChanged(currentTick) {
					var frames = animationService.getInstance().timeline.getMediaFrames(currentTick);
					canvasService.clear();
					angular.forEach(frames, function (frame) {
						canvasService.add( shapeCreator.createShapeFromFrame(frame, canvasService.getCanvasPosition()));
					});
				});
		}

		animationService.getInstance().addLoadCompleteObserver('CanvasCtrl', onAnimationLoad);
	});