'use strict';

angular.module('animatesApp')
	.controller('PlayerCtrl', function ToolbarPanelCtrl($scope, animationService, presentationPlayerService, canvasService, serverService, localAnimationStateService) {
		$scope.loading = true;
		$scope.playing = false;
		$scope.errorMessage = undefined;

		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.playing = !animationService.isEditingEnable;
			});

		function initializeLayout() {
			angular.element(document).ready(function () {
				angular.element('body').layout({
					spacing: 0,
					'north__paneSelector': '.outer-layout-north',
					'center__paneSelector': '.outer-layout-center'
				});

				var innerLayout = angular.element('div.outer-layout-center').layout({
					applyDefaultStyles: false,
					south:{
						size: 100,
						onresize : function (panelName, element) {
							var pane = angular.element(element);
							angular.element('animates-timelines').css('height', pane.height() - (pane.outerHeight() - pane.height()) + 'px');
						}
					}
				});
				innerLayout.resizeAll();
			});
		}

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

		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.playing = !animationService.isEditingEnable;
			});

		$scope.initializeAnimation = function (id) {
			$scope.loading = true;

			serverService.loadProject(id, function success(data) {
					animationService.getInstance().loadProject(data.animation);
					canvasService.createCanvas();
					initializeLayout();
					localAnimationStateService.setCurrentTick(0);
					$scope.loading = false;
				}, function error(data) {
					console.log('Error: ' + data);
					$scope.errorMessage = data || 'An error occurs.';
					$scope.loading = false;
				});
		};
	});
