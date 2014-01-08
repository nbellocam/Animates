'use strict';

angular.module('animatesApp')
	.service('canvasService', function Canvasservice(shapeSync, $window) {
		var fabric = $window.fabric,
			model = $window.model,
			createCanvas = function createCanvas(id) {
				var canvas = new fabric.Canvas(id);
				canvas.model = new model.Canvas();
				
				// TODO: Update Properties

				canvas.on('object:modified', function(options) {
					if (options.target) {
						shapeSync.syncFromFabric(options.target);
						//TODO work with the diff that is returned by the shapeSync.syncFromFabric method.
					}
				});

				return canvas;
			},
			canvasInstance = createCanvas('mainCanvas'),
			getInstance = function getInstance(){
				return canvasInstance;
			},
			setHeight = function setHeight(height){
				canvasInstance.setHeight(height);
				canvasInstance.model.height = height;
			},
			setWidth = function setWidth(width){
				canvasInstance.setWidth(width);
				canvasInstance.model.width = width;
			},
			setSize = function setSize(height, width){
				setHeight(height);
				setWidth(width);

				canvasInstance.calcOffset();
				
				updateViewport();
			},
			updateViewport = function updateViewport(viewportPorcentage, topPorcentage, leftPorcentage){
				viewportPorcentage = viewportPorcentage || 0.8;
				topPorcentage = topPorcentage || 0.1;
				leftPorcentage = leftPorcentage || leftPorcentage || 0.1;
				var viewport = canvasInstance.model.updateViewport(viewportPorcentage, topPorcentage, leftPorcentage);
				var rect = new fabric.Rect({
					left: viewport.left,
					top: viewport.top,
					fill: '#FAF8B9',
					width: viewport.width,
					height: viewport.height,
					borderColor : '#3F3F3F',
					evented: false,
					opacity: 0.2,
					selectable: false
				});

				rect.set({ strokeWidth: 2, stroke: '#3F3F3F' });

				canvasInstance.add(rect);
			},
			renderAll = function renderAll(){
				canvasInstance.renderAll();
			},
			add = function add(element){
				canvasInstance.add(element);
			},
			remove = function remove(element){
				canvasInstance.remove(element);
			};

		return {
			getInstance : getInstance,
			setSize : setSize,
			renderAll : renderAll,
			add : add,
			remove : remove
		};
	});
