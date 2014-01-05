'use strict';

angular.module('animatesApp')
	.factory('shapeSync', function () {
		var syncVisualMediaObject = function syncVisualMediaObject(fabricObject, fromFabric){         
				var model = fabricRect.model,
					diff = [];

					// Fabric Object: angle, borderColor, fill,height, width, opacity, top, left
					// http://fabricjs.com/docs/fabric.Object.html
				if (fromFabric){
					// TODO: update model properties from fabricRect;
					//Model properties: position.x,position.y, position.z, opacity, border.type, border.color
				} else {
					// TODO: update fabricRect properties from model;
				}

				return diff;
			},
			syncRectangle = function syncRectangle(fabricRect, fromFabric){
				var model = fabricRect.model,
					diff = syncVisualMediaObject(fabricRect, fromFabric);

				if (fromFabric){
					// TODO: update model properties from fabricRect;
					//Model properties: height, width
				} else {
					// TODO: update fabricRect properties from model;
				}

				return diff;
			},
			sync = function sync(fabricObject, fromFabric){
				var diff;

				switch (fabricObject.type) {
					case 'Rect':
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

