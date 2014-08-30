'use strict';

angular.module('animatesApp')
	.service('shapeSync', function shapeSync(localAnimationStateService, animationService, shapeHelper) {
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
			var type = shapeHelper.getTypeFromView(fabricObject);
			if (isTypeRegistered(type)) {
				registeredShapes[type].syncFromModel(fabricObject);
			}
		};
	});
