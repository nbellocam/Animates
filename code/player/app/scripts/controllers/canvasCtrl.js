'use strict';

angular.module('animatesPlayer')
	.controller('PlayerCanvasCtrl', function CanvasCtrl(playerCanvasService, playerLocalAnimationStateService, playerShapeCreator, playerAnimationService) {
		function onCurrentTickChanged(currentTick) {
			var frames = playerAnimationService.getInstance().timeline.getMediaFrames(currentTick);
			playerCanvasService.clear();
			playerCanvasService.stopAutomaticRendering();
			angular.forEach(frames, function (frame) {
				playerCanvasService.add( playerShapeCreator.createShapeFromFrame(frame));
			});
			playerCanvasService.render();
			playerCanvasService.startAutomaticRendering();
		}

		playerLocalAnimationStateService.addTickObserver('CanvasCtrl', onCurrentTickChanged);
	});
