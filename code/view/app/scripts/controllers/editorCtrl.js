/*global $*/
'use strict';

angular.module('animatesEditor')
	.controller('EditorCtrl', function EditorCtrl($scope, $timeout, canvasService, animationService, serverService, localAnimationStateService) {
		var innerLayout;

		function initializeLayout() {

			angular.element(document).ready(function () {
				angular.element('#editorContainer').layout({
					spacing: 0,
					'north__paneSelector': '.outer-layout-north',
					'center__paneSelector': '.outer-layout-center'
				});

				innerLayout = angular.element('div.outer-layout-center').layout({
					applyDefaultStyles: false,
					east:{
						size: 280
					},
					west:{
						size: 60,
						resizable:false
					},
					south:{
						size: 150,
						onresize : function (panelName, element) {
							var pane = $(element);
							$('animates-timelines').css('height', pane.height() - (pane.outerHeight() - pane.height()) + 'px');
						}
					},
					center: {
						onresize : function (panelName, element, state) {
							canvasService.updateSize(state.innerHeight, state.innerWidth);
						}
					}
				});
				innerLayout.resizeAll();
				canvasService.updateSize(innerLayout.state.center.innerHeight, innerLayout.state.center.innerWidth);
			});
		}

		$scope.loading = true;
		$scope.playing = false;
		$scope.errorMessage = undefined;

		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.playing = !animationService.isEditingEnable;
			});

		function createTestAnimation() {
			var newAnimation = animationService.getInstance();
			var shape = new animationService.Model.Rectangle({
				name : 'Test rectangle'
			});

			newAnimation.applyOperation('Shape', 'Create', {
				mediaObject: shape,
				tick : localAnimationStateService.getCurrentTick()
			}, { sender: 'testLoad' });

			animationService.getInstance().applyOperation('MediaFrame', 'Update', {
				mediaObjectId :  shape.getGuid(),
				updatedProperties: { angle: 30, 'position.x': 250, width: 230 },
				tick: 200,
			}, {
				sender: 'testLoad'
			});

			animationService.getInstance().applyOperation('MediaFrame', 'Update', {
				mediaObjectId :  shape.getGuid(),
				updatedProperties: { angle: 80, height: 430 },
				tick: 300,
			}, {
				sender: 'testLoad'
			});

			animationService.getInstance().applyOperation('MediaFrame', 'Update', {
				mediaObjectId :  shape.getGuid(),
				updatedProperties: { 'position.y': 350 },
				tick: 350,
			}, {
				sender: 'testLoad'
			});

			newAnimation.applyOperation('Effect', 'Create', {
				effect: new animationService.Model.FadeEffect(),
				mediaObjectId : shape.getGuid()
			}, { sender: 'testLoad' });

			return newAnimation;
		}

		$scope.initializeAnimation = function initializeAnimation(id) {
			$scope.loading = true;

			if (serverService.isAvailable()) {
				serverService.loadProject(id, function success(data) {
						canvasService.createCanvas();
						animationService.getInstance().loadProject(data.animation);
						serverService.joinProject(id);
						initializeLayout();
						localAnimationStateService.setCurrentTick(0);
						$scope.loading = false;
					}, function error(data) {
						console.log('Error: ' + data);
						$scope.errorMessage = data || 'An error occurs.';
						$scope.loading = false;
					});
			} else {
				$timeout(function() {
					var newAnimation = createTestAnimation(),
						json = animationService.Model.JsonSerializer.serializeObject(newAnimation);
					canvasService.createCanvas();
					animationService.getInstance().loadProject(json);
					initializeLayout();
					localAnimationStateService.setCurrentTick(0);
					$scope.loading = false;
				}, 600);
			}
		};
	});
