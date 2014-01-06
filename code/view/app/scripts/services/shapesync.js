'use strict';

angular.module('animatesApp')
	.factory('shapeSync', function () {
		var syncProperty = function syncVisualMediaObject(fabricProperty, model, fromFabric, propertyName, diff){
				var modelProperty = model.getProperty(propertyName);
				var newestValue = fromFabric ? fabricProperty : modelProperty;

				if (fabricProperty !== modelProperty){
					var diffElement = {
						oldValue : fromFabric ? modelProperty : fabricProperty,
						newValue : newestValue,
						propertyName : propertyName
					};

					diff.push(diffElement);

					if (fromFabric){
						model.setProperty(propertyName, newestValue);
					}
				}

				return newestValue;
			},
			syncVisualMediaObject = function syncVisualMediaObject(fabricObject, fromFabric){
				var model = fabricObject.model,
					diff = [];

					// Fabric Object: angle, borderColor, fill,height, width, opacity, top, left
					// http://fabricjs.com/docs/fabric.Object.html
				if (fromFabric){
					syncProperty(fabricObject.angle, model, fromFabric, 'angle', diff);
					syncProperty(fabricObject.left, model, fromFabric, 'position.x', diff);
					syncProperty(fabricObject.top, model, fromFabric, 'position.y', diff);
					// TODO: update model properties from fabricObject;
					//Model properties: position.x,position.y, position.z, opacity, border.type, border.color
				} else {
					// TODO: update fabricObject properties from model;
				}

				return diff;
			},
			syncRectangle = function syncRectangle(fabricRect, fromFabric){
				var model = fabricRect.model,
					diff = syncVisualMediaObject(fabricRect, fromFabric);

				if (fromFabric){
					// TODO: update model properties from fabricRect;
					//Model properties: height, width
					syncProperty(fabricRect.currentHeight || fabricRect.height, model, fromFabric, 'height', diff);
					syncProperty(fabricRect.currentWidth || fabricRect.width, model, fromFabric, 'width', diff);
				} else {
					// TODO: update fabricRect properties from model;
				}

				return diff;
			},
			sync = function sync(fabricObject, fromFabric){
				var diff;

				switch (fabricObject.type) {
					case 'rect':
						diff = syncRectangle(fabricObject, fromFabric);
						break;
					default:
						break;
				}

				return diff;
			},
			syncFromFabric = function syncFromFabric(fabricObject){
				return sync(fabricObject, true);
			},
			syncFromModel = function syncFromModel(fabricObject){
				return sync(fabricObject, false);
			};
		
		return {
			syncRectangle : syncRectangle,
			sync : sync,
			syncFromFabric : syncFromFabric,
			syncFromModel : syncFromModel
		};
	});

