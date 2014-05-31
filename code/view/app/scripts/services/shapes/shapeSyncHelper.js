'use strict';

angular.module('animatesApp')
	.factory('shapeSyncHelper', function shapeSyncHelper($window, effectCreator, animationService, localAnimationStateService, shapeHelper) {
		var syncModelProperty = function syncModelProperty(fabricValue, model, propertyName, diff, round) {
				var modelProperty = model.getProperty(propertyName),
					value = (round) ? $window.Math.round(fabricValue) : fabricValue;

				modelProperty = (round) ? $window.Math.round(modelProperty) : modelProperty;
				if (value !== modelProperty){
					diff[propertyName] = value;
				}
			},
			syncViewProperty = function syncViewProperty(modelValue, viewObject, propertyName) {
				var fabricProperty = viewObject.get(propertyName);

				if (modelValue !== fabricProperty){
					viewObject.set(propertyName, modelValue);
				}
			},

			startsAtCurrentTick = function startsAtCurrentTick(mediaTimeline) {
				return localAnimationStateService.startsAtCurrentTick(mediaTimeline);
			},

			syncVisualMediaObjectFromView = function syncVisualMediaObjectFromView(viewObject, canvasPosition) {
				var diff = {},
					mediaObject = shapeHelper.getMediaObjectFromView(viewObject);

				syncModelProperty(viewObject.angle, mediaObject, 'angle', diff, true);
				syncModelProperty(viewObject.left - canvasPosition.left, mediaObject, 'position.x', diff, true);
				syncModelProperty(viewObject.top - canvasPosition.top, mediaObject, 'position.y', diff, true);

				return diff;
			},
			syncVisualMediaObjectFromModel = function syncVisualMediaObjectFromModel(viewObject, canvasPosition) {
				var model = shapeHelper.getMediaFrameFromView(viewObject);

				syncViewProperty(model.getProperty('fill'), viewObject, 'fill');
				syncViewProperty(model.getProperty('angle'), viewObject, 'angle');
				syncViewProperty(model.getProperty('position.x') + canvasPosition.left, viewObject, 'left');
				syncViewProperty(model.getProperty('position.y') + canvasPosition.top, viewObject, 'top');
			};

		return {
			Fabric: $window.fabric,
			Model: $window.model,

			syncModelProperty: syncModelProperty,
			syncViewProperty: syncViewProperty,

			syncVisualMediaObjectFromModel: syncVisualMediaObjectFromModel,
			syncVisualMediaObjectFromView: syncVisualMediaObjectFromView,

			startsAtCurrentTick: startsAtCurrentTick
		};
	});
