'use strict';

angular.module('animatesApp')
	.service('animationService', function animationService($window, $timeout, canvasConfig, $http, connectionService) {
		var animationInstance,
			_self = this;

		this.Model = $window.model;
		this.errorMessage = undefined;
		this.isLoading = true;
			
		function createAnimation() {
			var canvas = new _self.Model.Canvas({
					height: canvasConfig.canvasDefaultSize.height,
					width: canvasConfig.canvasDefaultSize.width
				}),
				timeline = new _self.Model.Timeline();

			animationInstance = new _self.Model.Animation({
				canvas : canvas,
				timeline : timeline
			});
		}

		createAnimation();

		this.loadAnimation = function loadAnimation(id) {
			this.isLoading = true;
			console.log('loading project:' + id);
			if (connectionService.isAvailable()){
				connectionService.loadProject(id, function success(data) {
						//TODO deserialize data.Animation and loadIt
						console.log(data);
						_self.isLoading = false;
					}, function error(data) {
						console.log('Error: ' + data);
						_self.errorMessage = data || 'An error occurs.';
					});
			} else {
				$timeout(function() {
					_self.isLoading = false;
				}, 600);
			}

		};
		
		this.getInstance = function getInstance(){
			return animationInstance;
		};
	});
