'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function($scope, canvasService) {
		$scope.initialize = function() {
			canvasService.setSize(500, 800);
			canvasService.renderAll();
		};

		//TODO review: http://stackoverflow.com/questions/14703517/angular-js-set-element-height-on-page-load
		//
		//TODO http://stackoverflow.com/questions/18291838/integrating-fabricjs-and-angularjs
	});