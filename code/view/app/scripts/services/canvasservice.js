'use strict';

angular.module('animatesApp')
	.service('canvasService', function Canvasservice(shapeSync, $window, $rootScope, canvasConfig) {
		var fabric = $window.fabric,
			model = $window.model,
			canvasPosition = {
				left: canvasConfig.canvasMinPosition.left,
				top: canvasConfig.canvasMinPosition.top
			},
			selectedShape = null,
			canvasInstance,
			viewportInstance,
			updateCanvasPosition = function updateCanvasPosition(height, width){
				var top = (height - canvasInstance.model.height) / 2,
					left = (width - canvasInstance.model.width) / 2;

				canvasPosition.top = (top < canvasConfig.canvasMinPosition.top) ? canvasConfig.canvasMinPosition.top : top;
				canvasPosition.left = (left < canvasConfig.canvasMinPosition.left) ? canvasConfig.canvasMinPosition.left : left;

				if (!viewportInstance){
					viewportInstance = new fabric.Rect(canvasConfig.viewportInitialConfig);
					canvasInstance.add(viewportInstance);
				}

				viewportInstance.set({
					left: canvasPosition.left,
					top: canvasPosition.top,
					width: canvasInstance.model.width,
					height: canvasInstance.model.height
				});
			},
			updateAllObjects = function updateAllObjects(viewport, oldViewport){
				var diffTop = viewport.top - oldViewport.top,
					diffLeft = viewport.left - oldViewport.left,
					allObjects = canvasInstance.getObjects(),
					object;

				for (var i = 0; i < allObjects.length; i++) {
					object = allObjects[i];
					if (object !== viewportInstance) {
						object.set({
							left: diffLeft + object.left,
							top: diffTop + object.top
						});
						//TODO review what to do with the model
					}
				}
			},
			renderAll = function renderAll(){
				canvasInstance.renderAll();
			};

		return {
			createCanvas : function createCanvas(id, height, width) {
				var canvas = new fabric.Canvas(id, canvasConfig.canvasInitialConfig);

				canvas.model = new model.Canvas({
					height: height || canvasConfig.canvasDefaultSize.height,
					width: width || canvasConfig.canvasDefaultSize.width
				});
				
				// TODO: Update Properties

				canvas.on('object:modified', function(event) {
					if (event.target) {
						shapeSync.syncFromFabric(event.target);
						//TODO work with the diff that is returned by the shapeSync.syncFromFabric method.
						$rootScope.$broadcast('shapeChange', event.target);
					}
				});

				canvas.on('selection:cleared', function (){
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

				canvas.on('after:render', function(){
					canvas.calcOffset();
				});

				canvasInstance = canvas;
			},
			getInstance : function getInstance(){
				return canvasInstance;
			},
			updateSize : function updateSize(height, width){
				var getNewValue = function getNewValue(newValue, originalValue, minMargin){
					var minValue = originalValue + (minMargin * 2);
					return (minValue > newValue) ? minValue : newValue;
				};

				canvasInstance.setHeight(getNewValue(height, canvasInstance.model.height, canvasConfig.canvasMinPosition.top));
				canvasInstance.setWidth(getNewValue(width, canvasInstance.model.width, canvasConfig.canvasMinPosition.left));

				var oldCanvasPosition = {
					left : canvasPosition.left,
					top : canvasPosition.top
				};
				
				updateCanvasPosition(height, width);
				updateAllObjects(canvasPosition, oldCanvasPosition);

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
