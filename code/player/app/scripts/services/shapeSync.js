'use strict';

angular.module('animatesPlayer')
	.service('playerShapeSync', function playerShapeSync(playerShapeHelper) {
		var registeredShapes = {};

		function isTypeRegistered(type) {
			return (type && registeredShapes[type] &&
				registeredShapes[type].syncFromModel);
		}

		this.registerShape = function registerShape(type, syncFromModelFunction) {
			if (type && !isTypeRegistered(type) && (typeof(syncFromModelFunction) === 'function')) {
				registeredShapes[type] = {
					syncFromModel: syncFromModelFunction,
				};
			}
		};

		this.syncFromModel = function syncFromModel(fabricObject) {
			var type = playerShapeHelper.getTypeFromView(fabricObject);
			if (isTypeRegistered(type)) {
				registeredShapes[type].syncFromModel(fabricObject);
			}
		};
	});
