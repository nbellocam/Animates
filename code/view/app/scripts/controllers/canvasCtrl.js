'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function CanvasCtrl($scope, canvasService, localAnimationStateService, shapeCreator, animationService) {
		
		function onCurrentTickChanged(currentTick) {
			var frames = animationService.getInstance().timeline.getMediaFrames(currentTick);
			canvasService.clear();
			console.log('canvas capture');
			angular.forEach(frames, function (frame) {
				canvasService.add( shapeCreator.createShapeFromFrame(frame, canvasService.getCanvasPosition()));
			});
		}

		function onAnimationLoad() {
			
		}

		console.log('CanvasCtrl observer addded');
		localAnimationStateService.addTickObserver('TimelinePanelCtrl', onCurrentTickChanged);
		animationService.getInstance().addLoadCompleteObserver('CanvasCtrl', onAnimationLoad);
	});