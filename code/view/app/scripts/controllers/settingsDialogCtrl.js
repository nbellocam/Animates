'use strict';

angular.module('animatesApp')

.controller('settingsDialogCtrl', function ($scope, $modalInstance, animationService) {
	$scope.canvas = animationService.getInstance().toJSON().canvas.data;

	console.log($scope.canvas);

	$scope.close = function () {
		$modalInstance.dismiss('Canceled');
	};

	$scope.save = function () {
		$modalInstance.close($scope.canvas);
	};

});