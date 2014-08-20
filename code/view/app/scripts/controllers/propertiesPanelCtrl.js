'use strict';

angular.module('animatesApp')
	.controller('PropertiesPanelCtrl', function PropertiesPanelCtrl($scope, $rootScope, canvasService, animationService, propertyUpdateManagerService, localAnimationStateService, shapeHelper) {
		function applyOperation(target, operation, params) {
			animationService.getInstance().applyOperation(target, operation, params, { sender: 'PropertiesPanelCtrl' });
		}

		function safeApply() {
			if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
				$scope.$apply();
			}
		}

		$scope.shapeProperties = null;
		$scope.groupProperties = null;
		$scope.effectProperties = null;
		$scope.mediaObjectId = null;
		$scope.effectId = null;
		$scope.effectName = null;
		$scope.effectIsInfinite = false;

		//--- Effect related methods ---//

		$scope.isEffect = function () {
			return !$scope.isEffectEmpty();
		};

		$scope.isEffectEmpty = function () {
			return $scope.effectProperties === null;
		};

		$scope.onEffectUpdate = function (key, newValue) {
			var updatedOptions = {};
			updatedOptions[key] = newValue;

			applyOperation('Effect', 'Update', {
				mediaObjectId :  $scope.mediaObjectId,
				effectId : $scope.effectId,
				options: updatedOptions
			});
		};

		$scope.removeEffect = function () {
			if ($scope.mediaObjectId && $scope.effectId) {
				applyOperation('Effect', 'Remove', {
					mediaObjectId :  $scope.mediaObjectId,
					effectId : $scope.effectId
				});
			}
		};

		var cleanEffect = function () {
			$scope.effectProperties = null;
			$scope.effectName = null;
			$scope.effectId = null;
		};

		var selectedEffectChangeEventHandler = function selectedEffectChangeEventHandler(effect, mediaObjectId) {
			cleanAll();

			if (effect !== null) {
				$scope.effectProperties = effect.getPropertiesSchema();
				$scope.effectName = effect.getType().replace(/Effect/,'');
				$scope.effectId = effect.getGuid();
				$scope.effectIsInfinite = effect.isInfinite();
				$scope.mediaObjectId = mediaObjectId;
			}

			safeApply();
		};

		//--- Shape related methods ---//

		$scope.isShape = function () {
			return !$scope.isShapeEmpty();
		};

		$scope.isShapeEmpty = function () {
			return $scope.shapeProperties === null;
		};

		$scope.onShapeUpdate = function (key, newValue) {
			var values = {};

			values[key] = newValue;
			propertyUpdateManagerService.syncProperties($scope.mediaObjectId, values, 'PropertiesPanelCtrl');
		};

		$scope.removeShape = function () {
			if ($scope.mediaObjectId) {
				applyOperation('Shape', 'Remove', {
					mediaObjectId: $scope.mediaObjectId
				});
			}
		};

		var cleanShape = function () {
			$scope.shapeProperties = null;
			$scope.mediaObjectId = null;
		};

		var animationUpdateEventHandler = function animationUpdateEventHandler (target, operation, params) {
			var selectedShapes = localAnimationStateService.getSelectedShape(),
				mediaObjectId = params.mediaObjectId || params.mediaObject.getGuid();

			if (selectedShapes !== null) {
				if (shapeHelper.getGuidFromView(selectedShapes) === mediaObjectId) {
					var mediaFrame = shapeHelper.getMediaFrameFromView(selectedShapes);

					$scope.shapeProperties = mediaFrame ? mediaFrame.getPropertiesSchema() : null;
					safeApply();
				}
			}
		};

		//--- Group related methods ---//

		$scope.isGroup = function () {
			return !$scope.isGroupEmpty();
		};

		$scope.isGroupEmpty = function () {
			return $scope.groupProperties === null;
		};

		$scope.removeGroup = function () {
			var selectedShapes = localAnimationStateService.getSelectedShape();

			if (selectedElement) {
				if (selectedElement.isType('group')) {
					selectedElement.forEachObject(function (obj) {
						applyOperation('Shape', 'Remove', {
							mediaObjectId: shapeHelper.getGuidFromView(obj)
						});
					});
					canvasService.getInstance().discardActiveGroup().renderAll();
				}
			}
		};

		var cleanGroup = function () {
			$scope.groupProperties = null;
		};

		var createGroupProperties = function createGroupProperties(fabricGroup) {
			var canvasPosition = canvasService.getCanvasPosition();
			return {
				'# of items in group': fabricGroup.size(),
				'Group angle': fabricGroup.getAngle(),
				'Group x position': fabricGroup.left - canvasPosition.left,
				'Group y position': fabricGroup.top - canvasPosition.top,
			};
		};

		var selectedShapeChangeEventHandler = function selectedShapeChangeEventHandler (canvasShape) {
			cleanAll();

			if (canvasShape) {
				if (!canvasShape.isType('group')) {
					var mediaFrame = shapeHelper.getMediaFrameFromView(canvasShape);

					if (mediaFrame) {
						$scope.shapeProperties = mediaFrame.getPropertiesSchema();
						$scope.mediaObjectId = shapeHelper.getGuidFromView(canvasShape);
					}
				} else {
					$scope.groupProperties = createGroupProperties(canvasShape);
				}
			}

			safeApply();
		};

		//--- General related methods ---//
		$scope.isEmpty = function () {
			return $scope.isGroupEmpty() && $scope.isShapeEmpty() && $scope.isEffectEmpty();
		};

		var cleanAll = function () {
			cleanGroup();
			cleanShape();
			cleanEffect();
		};

		var animationLoadEventHandler = function animationLoadEventHandler () {
			cleanAll();
		};

		animationService.getInstance().addUpdateObserver('PropertiesPanelCtrl', animationUpdateEventHandler);
		animationService.getInstance().addLoadCompleteObserver('PropertiesPanelCtrl', animationLoadEventHandler);
		localAnimationStateService.addSelectedShapeObserver('PropertiesPanelCtrl', selectedShapeChangeEventHandler);
		localAnimationStateService.addSelectedEffectObserver('PropertiesPanelCtrl', selectedEffectChangeEventHandler);
	});
