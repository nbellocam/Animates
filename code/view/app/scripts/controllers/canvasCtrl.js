'use strict';

angular.module('animatesEditor')
	.controller('CanvasCtrl', function CanvasCtrl(canvasService, localAnimationStateService, shapeCreator, animationService) {
		function onCurrentTickChanged(currentTick) {
			var frames = animationService.getInstance().timeline.getMediaFrames(currentTick);
			canvasService.clear();
			canvasService.stopAutomaticRendering();
			angular.forEach(frames, function (frame) {
				canvasService.add( shapeCreator.createShapeFromFrame(frame, canvasService.getCanvasPosition()));
			});
			canvasService.render();
			canvasService.startAutomaticRendering();
		}

		function onAnimationLoad() {
			canvasService.updateViewport(animationService.getInstance().canvas);
		}

		localAnimationStateService.addTickObserver('CanvasCtrl', onCurrentTickChanged);
		animationService.getInstance().addLoadCompleteObserver('CanvasCtrl', onAnimationLoad);
	});
