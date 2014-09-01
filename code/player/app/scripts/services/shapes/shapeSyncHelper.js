'use strict';

angular.module('animatesPlayer')
	.factory('shapeSyncHelper', function shapeSyncHelper($window, animationService, shapeHelper) {
		var syncViewProperty = function syncViewProperty(modelValue, viewObject, propertyName) {
				var fabricProperty = viewObject.get(propertyName);

				if (modelValue !== fabricProperty) {
					viewObject.set(propertyName, modelValue);
				}
			},

			syncVisualMediaObjectFromModel = function syncVisualMediaObjectFromModel(viewObject) {
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
				syncViewProperty(model.getProperty('position.x'), viewObject, 'left');
				syncViewProperty(model.getProperty('position.y'), viewObject, 'top');
				viewObject.zindex = model.getProperty('position.z') + 1;
			};

		return {
			Fabric: $window.fabric,
			syncViewProperty: syncViewProperty,
			syncVisualMediaObjectFromModel: syncVisualMediaObjectFromModel
		};
	});
