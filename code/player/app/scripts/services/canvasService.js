'use strict';

angular.module('animatesPlayer')
	.service('playerCanvasService', function playerCanvasService($window, $rootScope, playerCanvasConfig, playerAnimationService) {
		var fabric = $window.fabric,
			canvasInstance;

		this.createCanvas = function createCanvas() {
			var canvas = new fabric.StaticCanvas('playerCanvas', playerCanvasConfig.canvasInitialConfig);
			canvas.model = playerAnimationService.getInstance().canvas;

			canvas.setHeight(canvas.model.height);
			canvas.setWidth(canvas.model.width);

			// TODO: Update Properties

			canvas.on('after:render', function() {
				canvas.calcOffset();
			});

			canvasInstance = canvas;
		};

		this.getInstance = function getInstance() {
			return canvasInstance;
		};

		this.add = function add(element) {
			canvasInstance.add(element);
		};

		this.clear = function clear() {
			if(canvasInstance) {
				canvasInstance.clear();
			}
		};

		this.stopAutomaticRendering = function () {
			canvasInstance.renderOnAddRemove = false;
		};

		this.startAutomaticRendering = function () {
			canvasInstance.renderOnAddRemove = true;
		};

		this.render = function () {
			canvasInstance.renderAll();
		};
	});
