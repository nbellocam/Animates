'use strict';

angular.module('animatesApp')
	.service('canvasService', function canvasService(shapeSync, $window, $rootScope, canvasConfig, animationService, shapeCreator, timelineService) {
		var fabric = $window.fabric,
			_self = this,
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
			},
			updateMediaObjectInCanvas = function updateMediaObjectInCanvas(mediaObjectId){
				var allObjects = canvasInstance.getObjects(),
					founded = false,
					newMediaFrame = timelineService.getMediaFrame(mediaObjectId),
					object;

				for (var i = 0; i < allObjects.length; i++) {
					object = allObjects[i];
					if (object.model && object.model.getMediaObjectGuid() === mediaObjectId) {
						founded = true;

						if (newMediaFrame) {
							object.model = newMediaFrame;
							shapeSync.syncFromModel(object, _self.getCanvasPosition());
						} else {
							_self.remove(object);
						}
					}
				}

				if (!founded && newMediaFrame){
					var shape = shapeCreator.createShapeFromFrame(newMediaFrame, _self.getCanvasPosition());
					if (shape){
						_self.add(shape);
					}
				}
			},
			canvasModelEventHandler = function canvasModelEventHandler(target, operation, params) {
				if (target === 'Shape') {
					switch (operation){
						case 'Create':
							var shape = shapeCreator.createShapeFromMediaObject(params.mediaObject, _self.getCanvasPosition());
							if (shape){
								_self.add(shape);
							}
							renderAll();

							break;
						case 'Update':
							updateMediaObjectInCanvas(params.mediaObjectId);
							renderAll();

							break;
						case 'Remove':
							var allObjects = canvasInstance.getObjects(),
								object;

							for (var i = 0; i < allObjects.length; i++) {
								object = allObjects[i];
								if (object.model && object.model.getMediaObjectGuid() === params.mediaObjectId) {
									_self.remove(object);
								}
							}
							renderAll();

							break;
						default:
							break;
					}
				} else if (target === 'Effect') {
					updateMediaObjectInCanvas(params.mediaObjectId);
					renderAll();
				}
			};

		this.createCanvas = function createCanvas(id) {
			var canvas = new fabric.Canvas(id, canvasConfig.canvasInitialConfig);
			canvas.model = animationService.getInstance().canvas;
			
			// TODO: Update Properties
			
			animationService.getInstance().addObserver('CanvasService', canvasModelEventHandler);

			canvas.on('object:modified', function(event) {
				if (event.target) {
					if (!event.target.isType('group')){
						shapeSync.syncFromFabric(event.target, _self.getCanvasPosition());
					}

					$rootScope.$broadcast('shapeChange', event.target);
				}
			});

			canvas.on('selection:cleared', function (){
				if (event.target && selectedShape) {
					if (selectedShape.isType('group')){
						var allObjects = canvas.getObjects(),
							object;

						for (var i = 0; i < allObjects.length; i++) {
							object = allObjects[i];
							if (object !== viewportInstance) {
								shapeSync.syncFromFabric(object, _self.getCanvasPosition());
							}
						}
					}
					selectedShape = null;
					$rootScope.$broadcast('selectedShapeChange', null);
				}
			});

			canvas.on('selection:created', function(event) {
				selectedShape = event.target;
				$rootScope.$broadcast('selectedShapeChange', selectedShape);
			});

			canvas.on('object:selected', function(event) {
				if (event.target)
				{
					selectedShape = event.target;
					$rootScope.$broadcast('selectedShapeChange', selectedShape);
				} else {
					$rootScope.$broadcast('selectedShapeChange', null);
				}
			});

			canvas.on('after:render', function(){
				canvas.calcOffset();
			});

			canvasInstance = canvas;
		};
		
		this.getInstance = function getInstance(){
			return canvasInstance;
		};

		this.updateSize = function updateSize(height, width){
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

			canvasInstance.forEachObject(function (obj){
				obj.setCoords();
			});
			renderAll();
		};

		this.add = function add(element){
			canvasInstance.add(element);
		};
		
		this.remove = function remove(element){
			canvasInstance.remove(element);
		};

		this.clear = function clear(){
			canvasInstance.clear();
			if (viewportInstance)
			{
				canvasInstance.add(viewportInstance);
			}
		};

		this.getSelectedShape = function getSelectedShape(){
			return selectedShape;
		};

		this.getCanvasPosition = function getCanvasPosition(){
			return {
				left : canvasPosition.left,
				top : canvasPosition.top
			};
		};
	});
