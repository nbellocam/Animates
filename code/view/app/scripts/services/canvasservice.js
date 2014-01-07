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

				//TODO create viewPort
				var rect = new fabric.Rect({
					left: 50,
					top: 50,
					fill: '#FAF8B9',
					width: width - 100,
					height: height - 100,
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
