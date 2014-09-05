'use strict';

angular.module('animatesEditor')
	.controller('ToolbarPanelCtrl', function ToolbarPanelCtrl($scope, canvasService, localAnimationStateService, animationService, shapeHelper, toolbarShapeService, effectHelper, toolbarEffectService, presentationPlayerService, dialogs) {
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
					effect: effectHelper.setDefaultTicks(effect, $scope.selectedShape),
					mediaObjectId : shapeHelper.getGuidFromView($scope.selectedShape)
				});
			}
		};

		$scope.getClassForEffectType = function(type) {
			return toolbarEffectService.getButtonClass(type);
		};

		$scope.registeredEffectTypes = toolbarEffectService.getRegisteredTypes();

		$scope.openSettings = function () {
			var dlg = dialogs.create('/views/dialogs/settings.html','settingsDialogCtrl',{},'lg');
			
			dlg.result.then(function(data){
				// Send changes only if there was any
				if (Object.keys(data).length !== 0) {
					animationService.getInstance().applyOperation('Canvas', 'Update', data, { sender: 'toolbar' });
				}
			});
		};
		
		// Other methods

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
