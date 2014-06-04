'use strict';

angular.module('animatesApp')
	.controller('ToolbarPanelCtrl', function ToolbarPanelCtrl($scope, canvasService, localAnimationStateService, animationService, shapeHelper, toolbarService, presentationPlayerService) {
		function applyOperation(target, operation, params) {
			animationService.getInstance().applyOperation(target, operation, params, { sender: 'toolbar' });
		}

		$scope.addType = function(type) {
			var mediaObject = toolbarService.createMediaObject(type);

			if (mediaObject) {
				applyOperation('Shape', 'Create', {
					mediaObject: toolbarService.createMediaObject(type),
					tick : localAnimationStateService.getCurrentTick()
				});
			}
		};

		$scope.getClassForType = function(type) {
			return toolbarService.getButtonClass(type);
		};

		$scope.registeredTypes = toolbarService.getRegisteredTypes();

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
	});
