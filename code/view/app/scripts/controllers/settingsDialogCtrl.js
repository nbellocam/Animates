'use strict';

angular.module('animatesApp')

.controller('settingsDialogCtrl', function ($scope, $modalInstance, animationService) {
	$scope.canvas = animationService.getInstance().toJSON().canvas.data;

	var originalCanvas = animationService.getInstance().toJSON().canvas.data;

	$scope.validateHeight = function () {
		return parseInt('0'+$scope.canvas.height, 10) > 0;
	};

	$scope.validateWidth = function () {
		return parseInt('0'+$scope.canvas.width, 10) > 0;
	};

	$scope.close = function () {
		$modalInstance.dismiss('Canceled');
	};

	$scope.save = function () {
		var changedCanvasProperties = {};

		if ($scope.canvas.height !== originalCanvas.height) {
			changedCanvasProperties.height = $scope.canvas.height;
		}

		if ($scope.canvas.width !== originalCanvas.width) {
			changedCanvasProperties.width = $scope.canvas.width;
		}

		if ($scope.canvas.backgroundColor !== originalCanvas.backgroundColor) {
			changedCanvasProperties.backgroundColor = $scope.canvas.backgroundColor;
		}

		$modalInstance.close(changedCanvasProperties);
	};

});