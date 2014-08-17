'use strict';

angular.module('animatesApp')
	.controller('ToolbarPanelCtrl', function ToolbarPanelCtrl($scope, canvasService, localAnimationStateService, animationService, shapeHelper, toolbarShapeService, effectHelper, toolbarEffectService, presentationPlayerService) {
		function applyOperation(target, operation, params) {
			animationService.getInstance().applyOperation(target, operation, params, { sender: 'toolbar' });
		}

		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.playing = !animationService.isEditingEnable;
			});

		localAnimationStateService.addSelectedShapeObserver('toolbar', function(selectedShape) {
			$scope.selectedShape = selectedShape;

			if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
				$scope.$apply();
			}
		});

		// Shape related methods
		$scope.addShapeType = function(type) {
			var mediaObject = toolbarShapeService.createMediaObject(type);

			if (mediaObject) {
				applyOperation('Shape', 'Create', {
					mediaObject: mediaObject,
					tick : localAnimationStateService.getCurrentTick()
				});
			}
		};

		$scope.getClassForShapeType = function(type) {
			return toolbarShapeService.getButtonClass(type);
		};

		$scope.registeredShapeTypes = toolbarShapeService.getRegisteredTypes();

		// Effect related methods
		$scope.addEffectType = function(type) {
			var effect = toolbarEffectService.createEffect(type);

			if (effect) {
				applyOperation('Effect', 'Create', {
					effect: effectHelper.setDefaltTicks(effect, $scope.selectedShape),
					mediaObjectId : shapeHelper.getGuidFromView($scope.selectedShape)
				});
			}
		};

		$scope.getClassForEffectType = function(type) {
			return toolbarEffectService.getButtonClass(type);
		};

		$scope.registeredEffectTypes = toolbarEffectService.getRegisteredTypes();

		// Other methods
		$scope.removeElements = function() {
			var selectedElement = canvasService.getSelectedShape();

			if (selectedElement) {
				if (selectedElement.isType('group')) {
					selectedElement.forEachObject(function (obj) {
						applyOperation('Shape', 'Remove', {
							mediaObjectId: shapeHelper.getGuidFromView(obj)
						});
					});
					canvasService.getInstance().discardActiveGroup().renderAll();
				} else {
					applyOperation('Shape', 'Remove', {
						mediaObjectId: shapeHelper.getGuidFromView(selectedElement)
					});
				}
			}
		};

		$scope.play = function () {
			presentationPlayerService.play();
		};

		$scope.pause = function () {
			presentationPlayerService.pause();
		};

		$scope.stop = function () {
			presentationPlayerService.stop();
		};

		$scope.stepForward = function () {
			presentationPlayerService.stepForward(50);
		};

		$scope.stepBackward = function () {
			presentationPlayerService.stepBackward(50);
		};
	});
