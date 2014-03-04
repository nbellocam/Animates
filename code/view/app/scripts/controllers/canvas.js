'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function ($scope, canvasService) {

		$scope.initialize = function initialize(id) {
			canvasService.createCanvas(id, 480, 640);
		};

		//TODO review: http://stackoverflow.com/questions/14703517/angular-js-set-element-height-on-page-load
		//
		//TODO http://stackoverflow.com/questions/18291838/integrating-fabricjs-and-angularjs
	});