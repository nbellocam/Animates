'use strict';

angular.module('animatesApp')
	.controller('PropertiesPanelCtrl', function PropertiesPanelCtrl($scope, $rootScope, canvasService, animationService, shapeHelper) {
		$scope.properties = null;

		var animationUpdateEventHandler = function animationUpdateEventHandler (target, operation, params) {
			var selectedShapes = canvasService.getSelectedShape(),
				mediaObjectId = params.mediaObjectId || params.mediaObject.getGuid();

			if (selectedShapes !== null) {
				if (shapeHelper.getGuidFromView(selectedShapes) === mediaObjectId) {
					var mediaFrame = shapeHelper.getMediaFrameFromView(selectedShapes);

					$scope.properties = mediaFrame ? mediaFrame.properties() : null;
					$scope.$apply();
				}
			}
		};

		var animationLoadEventHandler = function animationLoadEventHandler (){
			$scope.properties = null;
		};

		animationService.getInstance().addUpdateObserver('PropertiesPanelCtrl', animationUpdateEventHandler);
		animationService.getInstance().addLoadCompleteObserver('PropertiesPanelCtrl', animationLoadEventHandler);

		$scope.empty = function () {
			var isEmpty = ($scope.properties === null);
			return isEmpty;
		};

		var createGroupProperties = function createGroupProperties(fabricGroup){
			var canvasPosition = canvasService.getCanvasPosition();
			return {
				'# of items in group': fabricGroup.size(),
				'Group angle': fabricGroup.getAngle(),
				'Group x position': fabricGroup.left - canvasPosition.left,
				'Group y position': fabricGroup.top - canvasPosition.top,
			};
		};

		$rootScope.$on('selectedShapeChange', function (event, canvasShape){
			if (canvasShape === null) {
				$scope.properties = null;
			} else if (!canvasShape.isType('group')){
				var mediaFrame = shapeHelper.getMediaFrameFromView(canvasShape);

				$scope.properties = mediaFrame ? mediaFrame.properties() : null;
			} else {

				$scope.properties = createGroupProperties(canvasShape);
			}
			
			if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
				$scope.$apply();
			}
		});

		$rootScope.$on('shapeChange', function (event, canvasShape){
			var selectedShapes = canvasService.getSelectedShape();

			if (selectedShapes !== null) {
				if (selectedShapes.isType('group') && canvasShape.isType('group')) {
					$scope.properties = createGroupProperties(canvasShape);
					$scope.$apply();
				}
			}
		});
	});
