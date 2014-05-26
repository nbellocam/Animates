'use strict';

angular.module('animatesApp')
	.controller('EditorCtrl', function EditorCtrl($scope, $timeout, canvasService, animationService, serverService) {

		function initializeLayout(){
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
						size: 150
					},
					center: {
						onresize : function (panelName, element, state){
							canvasService.updateSize(state.innerHeight, state.innerWidth);
						}
					}
				});

				canvasService.updateSize(innerLayout.state.center.innerHeight, innerLayout.state.center.innerWidth);
			});
		}

		initializeLayout();

		$scope.loading = true;
		$scope.errorMessage = undefined;

		$scope.initializeAnimation = function initializeAnimation(id) {
			$scope.loading = true;
			if (serverService.isAvailable()){
				serverService.loadProject(id, function success(data) {
						animationService.getInstance().loadProject(data.animation);
						serverService.joinProject(id);
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
					$scope.loading = false;
				}, 600);
			}
		};
	});
