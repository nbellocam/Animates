'use strict';

angular.module('animatesApp')
	.service('canvasService', function canvasService(shapeSync, $window, $rootScope, canvasConfig, animationService, shapeCreator, localAnimationStateService, shapeHelper) {
		var fabric = $window.fabric,
			_self = this,
			canvasInstance,
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
					var shape = shapeCreator.createShapeFromFrame(newMediaFrame, _self.getCanvasPosition(), true);
					if (shape) {
						_self.add(shape);
						shape.setCoords();
					}
				}
			},
			animationUpdateEventHandler = function animationUpdateEventHandler(target, operation, params, context) {
				var allObjects, object, i;

				if (context.sender !== 'CanvasService') {
					if (target === 'MediaTimeline') {
						switch (operation) {
							case 'Create':
								var shape = shapeCreator.createShapeFromMediaTime(params.mediaTimeline, _self.getCanvasPosition(), true);
								if (shape) {
									_self.add(shape);
									canvasInstance.setActiveObject(shape);
									shape.setCoords();
								}
								_self.render();

								break;
							case 'Remove':
								allObjects = canvasInstance.getObjects();

								for (i = 0; i < allObjects.length; i++) {
									object = allObjects[i];
									if ( shapeHelper.getGuidFromView(object) === params.mediaObjectId) {
										_self.remove(object);
									}
								}
								_self.render();

								break;
							default:
								break;
						}
					} else if (target === 'Effect' || target === 'MediaFrame') {
						updateMediaObjectInCanvas(params.mediaObjectId);
						_self.render();
					}
				}
			};

		this.createCanvas = function createCanvas() {
			var canvas = new fabric.StaticCanvas('mainCanvas', canvasConfig.canvasInitialConfig);
			canvas.model = animationService.getInstance().canvas;

			// TODO: Update Properties

			animationService.getInstance().addUpdateObserver('CanvasService', animationUpdateEventHandler);

			canvas.on('after:render', function() {
				canvas.calcOffset();
			});

			canvasInstance = canvas;
		};

		this.getInstance = function getInstance() {
			return canvasInstance;
		};

		this.updateSize = function updateSize() {
			canvasInstance.setHeight(canvasInstance.model.height);
			canvasInstance.setWidth(canvasInstance.model.width);

			canvasInstance.forEachObject(function (obj) {
				obj.setCoords();
			});

			_self.render();
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
