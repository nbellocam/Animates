'use strict';

angular.module('animatesApp')
	.factory('shapeSyncHelper', function shapeSyncHelper($window, effectCreator, animationService, localAnimationStateService, shapeHelper) {
		var syncModelProperty = function syncModelProperty(fabricValue, model, propertyName, diff) {
				var modelProperty = model.getProperty(propertyName);

				if (fabricValue !== modelProperty){
					diff[propertyName] = fabricValue;
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
				var diff = {};

				var mediaTimeline = shapeHelper.getMediaTimelineFromView(viewObject);
				if (mediaTimeline) {
					if (startsAtCurrentTick(mediaTimeline)) {
						var mediaObject = mediaTimeline.getMediaObject();

						syncModelProperty(viewObject.angle, mediaObject, 'angle', diff);
						syncModelProperty(viewObject.left - canvasPosition.left, mediaObject, 'position.x', diff);
						syncModelProperty(viewObject.top - canvasPosition.top, mediaObject, 'position.y', diff);
					} else {
						effectCreator.addMoveEffectIfRequired(shapeHelper.getMediaFrameFromView(viewObject), viewObject, canvasPosition, mediaTimeline);
						// TODO: rotate effect if angle's property changed
					}
				}

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
