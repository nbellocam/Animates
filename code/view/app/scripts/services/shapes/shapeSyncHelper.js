'use strict';

angular.module('animatesEditor')
	.factory('shapeSyncHelper', function shapeSyncHelper($window, animationService, shapeHelper) {
		var syncModelProperty = function syncModelProperty(fabricValue, model, propertyName, diff, round) {
				var modelProperty = model.getProperty(propertyName),
					value = (round) ? $window.Math.round(fabricValue) : fabricValue;

				modelProperty = (round) ? $window.Math.round(modelProperty) : modelProperty;
				if (value !== modelProperty) {
					diff[propertyName] = value;
				}
			},
			syncViewProperty = function syncViewProperty(modelValue, viewObject, propertyName) {
				var fabricProperty = viewObject.get(propertyName);

				if (modelValue !== fabricProperty) {
					viewObject.set(propertyName, modelValue);
				}
			},

			syncVisualMediaObjectFromView = function syncVisualMediaObjectFromView(viewObject, canvasPosition) {
				var diff = {},
					mediaObject = shapeHelper.getMediaFrameFromView(viewObject),
					top = viewObject.top - canvasPosition.top,
					left = viewObject.left - canvasPosition.left,
					angle = viewObject.angle > 360 ? viewObject.angle - 360 : viewObject.angle;

				syncModelProperty(angle, mediaObject, 'angle', diff, true);
				syncModelProperty(left, mediaObject, 'position.x', diff, true);
				syncModelProperty(top, mediaObject, 'position.y', diff, true);

				return diff;
			},
			syncVisualMediaObjectFromModel = function syncVisualMediaObjectFromModel(viewObject, canvasPosition) {
				var model = shapeHelper.getMediaFrameFromView(viewObject);

				syncViewProperty(model.getProperty('border.color'), viewObject, 'stroke');
				syncViewProperty(model.getProperty('border.width'), viewObject, 'strokeWidth');
				
				switch (model.getProperty('border.type')) {
					case 'none' :
						syncViewProperty(null, viewObject, 'stroke');
						break;
					case 'dashed':
						syncViewProperty([3,3], viewObject, 'strokeDashArray');
						break;
					case 'dotted':
						syncViewProperty([1,2], viewObject, 'strokeDashArray');
						break;
					case 'solid':
					default:
						syncViewProperty([0,0], viewObject, 'strokeDashArray');
				}

				syncViewProperty(model.getProperty('fill'), viewObject, 'fill');
				syncViewProperty(model.getProperty('opacity'), viewObject, 'opacity');
				syncViewProperty(model.getProperty('angle'), viewObject, 'angle');
				syncViewProperty(model.getProperty('position.x') + canvasPosition.left, viewObject, 'left');
				syncViewProperty(model.getProperty('position.y') + canvasPosition.top, viewObject, 'top');
				viewObject.zindex = model.getProperty('position.z') + 1;
			};

		return {
			Fabric: $window.fabric,
			Model: $window.model,

			syncModelProperty: syncModelProperty,
			syncViewProperty: syncViewProperty,

			syncVisualMediaObjectFromModel: syncVisualMediaObjectFromModel,
			syncVisualMediaObjectFromView: syncVisualMediaObjectFromView
		};
	});
