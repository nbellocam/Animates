'use strict';

angular.module('animatesApp')
	.controller('CanvasCtrl', function($scope, canvasService, $window) {
		var w = angular.element($window);

		$scope.initialize = function() {
			canvasService.setSize(w.height() * 0.7, w.width() * 0.86 );
			canvasService.renderAll();
		};

		$scope.getWindowDimensions = function () {
			return { 'h': w.height() * 0.7, 'w': w.width() * 0.86 };
		};

		$scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
			// TODO: Add again all the object that are being cleared.
			canvasService.clear();
			canvasService.setSize(newValue.h, newValue.w);
			canvasService.renderAll();

		}, true);

		w.bind('resize', function () {
			$scope.$apply();
		});

		//TODO review: http://stackoverflow.com/questions/14703517/angular-js-set-element-height-on-page-load
		//
		//TODO http://stackoverflow.com/questions/18291838/integrating-fabricjs-and-angularjs
	});