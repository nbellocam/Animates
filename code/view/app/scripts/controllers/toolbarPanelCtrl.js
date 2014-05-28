'use strict';

angular.module('animatesApp')
	.controller('ToolbarPanelCtrl', function ToolbarPanelCtrl($scope, canvasService, localAnimationStateService, animationService, shapeHelper) {
		function applyOperation(target, operation, params){
			animationService.getInstance().applyOperation(target, operation, params, { sender: 'toolbar' });
		}

		$scope.addRectangle = function() {
			applyOperation('Shape', 'Create', {
				mediaObject: new animationService.Model.Rectangle(),
				tick : localAnimationStateService.getCurrentTick()
			});
		};

		$scope.addCircle = function() {
			//alert('Circle still not available!');
		};

		$scope.addTriangle = function() {
			//alert('Triangle still not available!');
		};

		$scope.addStar = function() {
			//alert('Star still not available!');
		};

		$scope.addImage = function() {
			//alert('Image still not available!');
		};

		$scope.addText = function() {
			//alert('Text still not available!');
		};

		$scope.addSound = function() {
			//alert('Sound still not available!');
		};

		$scope.removeElements = function() {
			var selectedElement = canvasService.getSelectedShape();

			if (selectedElement){
				if (selectedElement.isType('group')){
					selectedElement.forEachObject(function (obj){
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
	});
