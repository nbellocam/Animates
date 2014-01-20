'use strict';

angular.module('animatesApp')
	.service('canvasService', function Canvasservice(shapeSync, $window, $rootScope) {
		var fabric = $window.fabric,
			model = $window.model,
			viewportHeight = 500,
			viewportWidth = 500,
			minTop = 100,
			minLeft = 100,
			selectedShape = null,
			createCanvas = function createCanvas(id, height, width) {
				var canvas = new fabric.Canvas(id);
				canvas.model = new model.Canvas();
				viewportHeight = height || viewportHeight;
				viewportWidth = width || viewportWidth;
				
				// TODO: Update Properties

				canvas.on('object:modified', function(event) {
					if (event.target) {
						shapeSync.syncFromFabric(event.target);
						//TODO work with the diff that is returned by the shapeSync.syncFromFabric method.
						$rootScope.$broadcast('shapeChange', event.target);
					}
				});

				canvas.on('selection:cleared', function (event){
					$rootScope.$broadcast('selectedShapeChange', null);
				});

				canvas.on('object:selected', function(event) {
					if (!event.target._objects)
					{
						selectedShape = event.target;
						$rootScope.$broadcast('selectedShapeChange', event.target);
					} else {
						$rootScope.$broadcast('selectedShapeChange', null);
					}
				});

				canvas.on("after:render", function(){canvas.calcOffset();});

				return canvas;
			},
			canvasInstance = createCanvas('mainCanvas', 480, 640),
			viewportInstance,
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
			updateViewport = function updateViewport(height, width){
				var top = (height - viewportHeight) / 2,
					left = (width - viewportWidth) / 2;

				top = (top < minTop) ? minTop : top;
				left = (left < minLeft) ? minLeft : left;

				var viewport = canvasInstance.model.updateViewportBySize(viewportHeight, viewportWidth, top, left);

				if (viewportInstance){
					viewportInstance.set({ 
						left: viewport.left,
						top: viewport.top,
						width: viewport.width,
						height: viewport.height
					});
				} else {
					viewportInstance = new fabric.Rect({
						left: viewport.left,
						top: viewport.top,
						fill: '#C0C0C0',
						width: viewport.width,
						height: viewport.height,
						borderColor : '#3F3F3F',
						evented: false,
						opacity: 0.2,
						selectable: false,
						strokeWidth: 2,
						stroke: '#3F3F3F'
					});

					canvasInstance.add(viewportInstance);
				}

				return viewport;
			},
			updateAllObjects = function updateAllObjects(viewport){
				//TODO update all the objects taking in consideration the new viewport
			},
			renderAll = function renderAll(){
				canvasInstance.renderAll();
			};

		return {
			getInstance : function getInstance(){
				return canvasInstance;
			},
			updateSize : function updateSize(height, width){
				setHeight(height);
				setWidth(width);

				var viewport = updateViewport(height, width);
				updateAllObjects(viewport);

				renderAll();
			},
			add : function add(element){
				canvasInstance.add(element);
			},
			remove : function remove(element){
				canvasInstance.remove(element);
			},
			clear : function clear(){
				canvasInstance.clear();
			},
			getSelectedShape : function getSelectedShape (){
				return selectedShape;
			}
		};
	});
