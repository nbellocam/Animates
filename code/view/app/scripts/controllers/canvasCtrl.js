'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function CanvasCtrl($scope, canvasService, localAnimationStateService, shapeCreator, animationService) {
		
		function onCurrentTickChanged(currentTick) {
			var frames = animationService.getInstance().timeline.getMediaFrames(currentTick);
			canvasService.clear();
			angular.forEach(frames, function (frame) {
				canvasService.add( shapeCreator.createShapeFromFrame(frame, canvasService.getCanvasPosition()));
			});
		}

		function onAnimationLoad() {
			
		}

		localAnimationStateService.addTickObserver('CanvasCtrl', onCurrentTickChanged);
		animationService.getInstance().addLoadCompleteObserver('CanvasCtrl', onAnimationLoad);
	});