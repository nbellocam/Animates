'use strict';

angular.module('animatesApp')
	.factory('shapeSync', function () {
		var syncProperty = function syncProperty(fabricProperty, model, fromFabric, propertyName, diff){
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
			syncVisualMediaObject = function syncVisualMediaObject(fabricObject, canvasPosition, fromFabric){
				var model = fabricObject.model,
					diff = [];

					// Fabric Object: angle, borderColor, fill,height, width, opacity, top, left
					// http://fabricjs.com/docs/fabric.Object.html
				if (fromFabric){
					syncProperty(fabricObject.angle, model, fromFabric, 'angle', diff);
					syncProperty(fabricObject.left - canvasPosition.left, model, fromFabric, 'position.x', diff);
					syncProperty(fabricObject.top - canvasPosition.top, model, fromFabric, 'position.y', diff);
					// TODO: update model properties from fabricObject;
					//Model properties: position.x,position.y, position.z, opacity, border.type, border.color
				} else {
					// TODO: update fabricObject properties from model;
				}

				return diff;
			},
			syncRectangle = function syncRectangle(fabricRect, canvasPosition, fromFabric){
				var model = fabricRect.model,
					diff = syncVisualMediaObject(fabricRect, canvasPosition, fromFabric);

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
			sync = function sync(fabricObject, canvasPosition, fromFabric){
				var diff;

				switch (fabricObject.type) {
					case 'rect':
						diff = syncRectangle(fabricObject, canvasPosition, fromFabric);
						break;
					default:
						break;
				}

				return diff;
			},
			syncFromFabric = function syncFromFabric(fabricObject, canvasPosition){
				return sync(fabricObject, canvasPosition, true);
			},
			syncFromModel = function syncFromModel(fabricObject, canvasPosition){
				return sync(fabricObject, canvasPosition, false);
			};
		
		return {
			syncRectangle : syncRectangle,
			sync : sync,
			syncFromFabric : syncFromFabric,
			syncFromModel : syncFromModel
		};
	});

