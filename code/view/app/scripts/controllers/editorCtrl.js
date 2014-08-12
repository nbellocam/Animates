/*global $*/
'use strict';

angular.module('animatesApp')
	.controller('EditorCtrl', function EditorCtrl($scope, $timeout, canvasService, animationService, serverService) {
		function initializeLayout() {

			angular.element(document).ready(function () {
				angular.element('body').layout({
					spacing: 0,
					'north__paneSelector': '.outer-layout-north',
					'center__paneSelector': '.outer-layout-center'
				});

				var innerLayout = angular.element('div.outer-layout-center').layout({
					applyDefaultStyles: false,
					west:{
						size: 60,
						resizable:false
					},
					south:{
						size: 230,
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

		$scope.initializeAnimation = function initializeAnimation(id) {
			$scope.loading = true;
			if (serverService.isAvailable()) {
				serverService.loadProject(id, function success(data) {
						animationService.getInstance().loadProject(data.animation);
						serverService.joinProject(id);
						canvasService.createCanvas();
						initializeLayout();
						$scope.loading = false;
					}, function error(data) {
						console.log('Error: ' + data);
						$scope.errorMessage = data || 'An error occurs.';
						$scope.loading = false;
					});
			} else {
				$timeout(function() {
					var newAnimation = animationService.getInstance(),
						json = animationService.Model.JsonSerializer.serializeObject(newAnimation);
					animationService.getInstance().loadProject(json);
					canvasService.createCanvas();
					initializeLayout();
					$scope.loading = false;
				}, 600);
			}
		};
	});
