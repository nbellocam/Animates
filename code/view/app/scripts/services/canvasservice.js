'use strict';

angular.module('animatesApp')
	.service('canvasService', function Canvasservice(shapeSync, $window) {
		var fabric = $window.fabric,
			model = $window.model,
			viewportHeight = 500,
			viewportWidth = 500,
			minTop = 100,
			minLeft = 100,
			createCanvas = function createCanvas(id, height, width) {
				var canvas = new fabric.Canvas(id);
				canvas.model = new model.Canvas();
				viewportHeight = height || viewportHeight;
				viewportWidth = width || viewportWidth;
				
				// TODO: Update Properties

				canvas.on('object:modified', function(options) {
					if (options.target) {
						shapeSync.syncFromFabric(options.target);
						//TODO work with the diff that is returned by the shapeSync.syncFromFabric method.
					}
				});

				return canvas;
			},
			canvasInstance = createCanvas('mainCanvas', 480, 640),
			getInstance = function getInstance(){
				return canvasInstance;
			},
			setHeight = function setHeight(height){
				var minHeight = viewportHeight + (minTop * 2);
				height = (minHeight > height) ? minHeight : height;
				canvasInstance.setHeight(height);
				canvasInstance.model.height = height;
			},
			setWidth = function setWidth(width){
				var minWidth = viewportWidth + (minLeft * 2);
				width = (minWidth > width) ? minWidth : width;
				canvasInstance.setWidth(width);
				canvasInstance.model.width = width;
			},
			setSize = function setSize(height, width){
				setHeight(height);
				setWidth(width);

				canvasInstance.calcOffset();

				updateViewport(height, width);
			},
			updateViewport = function updateViewport(height, width){
				var top = (height - viewportHeight) / 2,
					left = (width - viewportWidth) / 2;

				top = (top < minTop) ? minTop : top;
				left = (left < minLeft) ? minLeft : left;

				var viewport = canvasInstance.model.updateViewportBySize(viewportHeight, viewportWidth, top, left);

				var rect = new fabric.Rect({
					left: viewport.left,
					top: viewport.top,
					fill: '#C0C0C0',
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
			},
			clear = function clear(){
				canvasInstance.clear();
			};

		return {
			getInstance : getInstance,
			setSize : setSize,
			renderAll : renderAll,
			add : add,
			remove : remove,
			clear : clear
		};
	});
