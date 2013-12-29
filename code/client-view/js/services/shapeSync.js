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
				//TODO change to use switch if it is posible
				if (fabricObject.type === 'Rect'){
					return syncRectangle(fabricObject, fromFabric);
				}
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
