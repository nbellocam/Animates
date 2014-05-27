'use strict';

angular.module('animatesApp')
	.factory('shapeSync', function shapeSync(localAnimationStateService, effectCreator, animationService) {
		function isEmpty(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					return false;
				}
			}

			return true;
		}

		var syncModelProperty = function syncModelProperty(fabricValue, model, propertyName, diff){
				var modelProperty = model.getProperty(propertyName);

				if (fabricValue !== modelProperty){
					diff[propertyName] = fabricValue;
				}
			},
			syncFabricProperty = function syncProperty(modelValue, fabricObject, propertyName){
				var fabricProperty = fabricObject.get(propertyName);

				if (modelValue !== fabricProperty){
					fabricObject.set(propertyName, modelValue);
				}
			},
			syncVisualMediaObject = function syncVisualMediaObject(fabricObject, canvasPosition, fromFabric){
				var model = fabricObject.model,
					diff = {};

					// Fabric Object: angle, borderColor, fill,height, width, opacity, top, left
					// http://fabricjs.com/docs/fabric.Object.html
				if (fromFabric){
					var mediaTimeline = animationService.getInstance().timeline.getMediaTimeline(model.getMediaObjectGuid());

					if (localAnimationStateService.startsAtCurrentTick(mediaTimeline)){
						var mediaObject = mediaTimeline.getMediaObject();

						syncModelProperty(fabricObject.angle, mediaObject, 'angle', diff);
						syncModelProperty(fabricObject.left - canvasPosition.left, mediaObject, 'position.x', diff);
						syncModelProperty(fabricObject.top - canvasPosition.top, mediaObject, 'position.y', diff);
					} else {
						effectCreator.addMoveEffectIfRequired(model, fabricObject, canvasPosition, mediaTimeline);
						// TODO: rotate effect if angle's property changed
					}
					
					// TODO: update model properties from fabricObject;
					//Model properties: position.x,position.y, position.z, opacity, border.type, border.color
				} else {
					syncFabricProperty(model.getProperty('fill'), fabricObject, 'fill');
					syncFabricProperty(model.getProperty('angle'), fabricObject, 'angle');
					syncFabricProperty(model.getProperty('position.x') + canvasPosition.left, fabricObject, 'left');
					syncFabricProperty(model.getProperty('position.y') + canvasPosition.top, fabricObject, 'top');
					// TODO: update fabricObject properties from model;
				}

				return diff;
			},
			syncRectangle = function syncRectangle(fabricRect, canvasPosition, fromFabric){
				var model = fabricRect.model,
					diff = syncVisualMediaObject(fabricRect, canvasPosition, fromFabric);

				if (fromFabric){
					var mediaTimeline = animationService.getInstance().timeline.getMediaTimeline(model.getMediaObjectGuid());

					if (localAnimationStateService.startsAtCurrentTick(mediaTimeline)){
						var mediaObject = mediaTimeline.getMediaObject();

						syncModelProperty(fabricRect.currentHeight || fabricRect.height, mediaObject, 'height', diff);
						syncModelProperty(fabricRect.currentWidth || fabricRect.width, mediaObject, 'width', diff);
					} else {
						// TODO: scale effect if properties changed
					}

					fabricRect.model = mediaTimeline.getMediaFrameFor(localAnimationStateService.getCurrentTick());
				} else {
					syncFabricProperty(model.getProperty('height'), fabricRect, 'height');
					syncFabricProperty(model.getProperty('width'), fabricRect, 'width');
					// TODO: update fabricRect properties from model;
				}

				return diff;
			},
			sync = function sync(fabricObject, canvasPosition, fromFabric){
				var diff;

				switch (fabricObject.type) {
					case 'rect':
						diff = syncRectangle(fabricObject, canvasPosition, fromFabric);
						break;
					default:
						break;
				}

				return (isEmpty(diff)) ? undefined : diff;
			},
			syncFromFabric = function syncFromFabric(fabricObject, canvasPosition){
				return sync(fabricObject, canvasPosition, true);
			},
			syncFromModel = function syncFromModel(fabricObject, canvasPosition){
				return sync(fabricObject, canvasPosition, false);
			};
		
		return {
			syncFromFabric : syncFromFabric,
			syncFromModel : syncFromModel
		};
	});

