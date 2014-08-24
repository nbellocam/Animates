'use strict';

angular.module('animatesApp')
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

		localAnimationStateService.addTickObserver('CanvasCtrl', onCurrentTickChanged);
	});
