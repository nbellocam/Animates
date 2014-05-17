'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function CanvasCtrl($scope, canvasService, timelineService, shapeCreator, animationService) {

		$scope.initialize = function initialize(id) {
			//animationService.createAnimation(480, 640);
			var canvas = animationService.getInstance().canvas;
			canvas.height = 480;
			canvas.width = 640;

			canvasService.createCanvas(id);
		};

		$scope.$watch(function () {
				return timelineService.getCurrentTick();
			},
			function () {
				var frames = timelineService.getMediaFrames();
				canvasService.clear();
				angular.forEach(frames, function (frame) {
					canvasService.add(shapeCreator.createShapeFromFrame(frame, canvasService.getCanvasPosition()));
				});
			});
		//TODO review: http://stackoverflow.com/questions/14703517/angular-js-set-element-height-on-page-load
		//
		//TODO http://stackoverflow.com/questions/18291838/integrating-fabricjs-and-angularjs
	});