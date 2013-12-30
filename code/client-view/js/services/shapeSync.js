'use strict';

angular.module('animates')
	.factory('shapeSync', function () {
		var syncRectangle = function syncRectangle(fabricRect, fromFabric){
				var diff = [],
					model = fabricRect.model;

				if (fromFabric){
					// TODO: update model properties from fabricRect;
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
