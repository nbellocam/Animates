'use strict';

angular.module('animatesApp')
	.service('canvasService', function canvasService(shapeSync, $window, $rootScope, canvasConfig, animationService, shapeCreator, localAnimationStateService, shapeHelper, propertyUpdateManagerService) {
		var fabric = $window.fabric,
			_self = this,
			canvasPosition = {
				left: canvasConfig.canvasMinPosition.left,
				top: canvasConfig.canvasMinPosition.top
			},
			canvasInstance,
			viewportInstance,
			updateCanvasPosition = function updateCanvasPosition(height, width) {
				var top = (height - canvasInstance.model.height) / 2,
					left = (width - canvasInstance.model.width) / 2;

				canvasPosition.top = (top < canvasConfig.canvasMinPosition.top) ? canvasConfig.canvasMinPosition.top : top;
				canvasPosition.left = (left < canvasConfig.canvasMinPosition.left) ? canvasConfig.canvasMinPosition.left : left;

				if (!viewportInstance) {
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
			updateAllObjects = function updateAllObjects(viewport, oldViewport) {
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
			renderAll = function renderAll() {
				canvasInstance.renderAll();
			},
			updateMediaObjectInCanvas = function updateMediaObjectInCanvas(mediaObjectId) {
				var allObjects = canvasInstance.getObjects(),
					founded = false,
					newMediaFrame = animationService.getInstance().timeline.getMediaFrameFor(mediaObjectId, localAnimationStateService.getCurrentTick()),
					object;

				for (var i = 0; i < allObjects.length; i++) {
					object = allObjects[i];
					if (shapeHelper.getGuidFromView(object) === mediaObjectId) {
						founded = true;

						if (newMediaFrame) {
							shapeSync.syncFromModel(object, _self.getCanvasPosition());
							object.setCoords();
						} else {
							_self.remove(object);
						}
					}
				}

				if (!founded && newMediaFrame) {
					var shape = shapeCreator.createShapeFromFrame(newMediaFrame, _self.getCanvasPosition());
					if (shape) {
						_self.add(shape);
						shape.setCoords();
					}
				}
			},
			animationUpdateEventHandler = function animationUpdateEventHandler(target, operation, params, context) {
				var allObjects, object, i;

				if (context.sender !== 'CanvasService') {
					if (target === 'Shape') {
						switch (operation) {
							case 'Create':
								var shape = shapeCreator.createShapeFromMediaObject(params.mediaObject, _self.getCanvasPosition());
								if (shape) {
									_self.add(shape);
									shape.moveTo(shape.zindex);
									shape.setCoords();
								}
								renderAll();

								break;
							case 'Update':
								updateMediaObjectInCanvas(params.mediaObjectId);
								renderAll();

								break;
							case 'Remove':
								allObjects = canvasInstance.getObjects();

								for (i = 0; i < allObjects.length; i++) {
									object = allObjects[i];
									if ( shapeHelper.getGuidFromView(object) === params.mediaObjectId) {
										_self.remove(object);
									}
								}
								renderAll();

								break;
							default:
								break;
						}
					} else if (target === 'Effect' || target === 'MediaFrame') {
						updateMediaObjectInCanvas(params.mediaObjectId);
						renderAll();
					}
				}
			},
			animationLoadEventHandler = function animationLoadEventHandler() {
				var shape, i,
					animation = animationService.getInstance(),
					mediaFrames = animation.timeline.getMediaFrames(localAnimationStateService.getCurrentTick());

				_self.clear();
				for (i = mediaFrames.length - 1; i >= 0; i--) {
					shape = shapeCreator.createShapeFromFrame(mediaFrames[i], _self.getCanvasPosition());
					if (shape) {
						_self.add(shape);
					}
				}

				renderAll();
			};

		this.createCanvas = function createCanvas() {
			var canvas = new fabric.Canvas('mainCanvas', canvasConfig.canvasInitialConfig);
			canvas.model = animationService.getInstance().canvas;

			// TODO: Update Properties

			animationService.getInstance().addUpdateObserver('CanvasService', animationUpdateEventHandler);
			animationService.getInstance().addLoadCompleteObserver('CanvasService', animationLoadEventHandler);

			function onCanvasObjectChanged(event) {
				var target = event.target;
				if (target) {
					if (!target.isType('group')) {
						var updatedProperties = shapeSync.syncFromView(target, _self.getCanvasPosition());
						propertyUpdateManagerService.syncProperties(shapeHelper.getGuidFromView(target), updatedProperties, 'CanvasService');
					} else {
						//TODO do we have to update every shape inside the group?
					}
				}
			}

			canvas.on('text:editing:exited', onCanvasObjectChanged);

			canvas.on('object:modified', onCanvasObjectChanged);

			canvas.on('selection:cleared', function () {
				/* if (selectedShape) {
					if (selectedShape.isType('group')) {
						var allObjects = canvas.getObjects(),
							object;

						for (var i = 0; i < allObjects.length; i++) {
							object = allObjects[i];
							if (object !== viewportInstance) {
								var updatedProperties = shapeSync.syncFromView(object, _self.getCanvasPosition());
								propertyUpdateManagerService.syncProperties(shapeHelper.getGuidFromView(object), updatedProperties, 'CanvasService');
							}
						}
					}
					selectedShape = null;
					$rootScope.$broadcast('selectedShapeChange', null);
				}*/

				localAnimationStateService.clearAllSelected();
			});

			canvas.on('selection:created', function(event) {
				localAnimationStateService.clearAllSelected();
				localAnimationStateService.setSelectedShape(event.target);
			});

			canvas.on('object:selected', function(event) {
				localAnimationStateService.clearAllSelected();

				if (event.target)
				{
					localAnimationStateService.setSelectedShape(event.target);
				}
			});

			canvas.on('after:render', function() {
				canvas.calcOffset();
			});

			canvasInstance = canvas;
		};

		this.getInstance = function getInstance() {
			return canvasInstance;
		};

		this.updateSize = function updateSize(height, width) {
			var getNewValue = function getNewValue(newValue, originalValue, minMargin) {
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

			canvasInstance.forEachObject(function (obj) {
				obj.setCoords();
			});
			renderAll();
		};

		this.add = function add(element) {
			canvasInstance.add(element);
		};

		this.remove = function remove(element) {
			canvasInstance.remove(element);
		};

		this.clear = function clear() {
			if(canvasInstance) {
				canvasInstance.clear();

				if (viewportInstance)
				{
					canvasInstance.add(viewportInstance);
				}
			}
		};

		this.getCanvasPosition = function getCanvasPosition() {
			return {
				left : canvasPosition.left,
				top : canvasPosition.top
			};
		};
	});
