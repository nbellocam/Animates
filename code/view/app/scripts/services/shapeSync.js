'use strict';

angular.module('animatesApp')
	.service('shapeSync', function shapeSync(localAnimationStateService, animationService, shapeHelper) {
		var registeredShapes = {};

		function isTypeRegistered(type) {
			return (type && registeredShapes[type] &&
				registeredShapes[type].syncFromModel &&
				registeredShapes[type].syncFromView);
		}

		this.registerShape = function registerShape(type, syncFromModelFunction, syncFromViewFunction) {
			if (type && !isTypeRegistered(type) &&
					(typeof(syncFromModelFunction) === 'function') &&
					(typeof(syncFromViewFunction) === 'function')) {

				registeredShapes[type] = {
					syncFromModel: syncFromModelFunction,
					syncFromView: syncFromViewFunction
				};
			}
		};

		function isEmpty(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					return false;
				}
			}

			return true;
		}

		this.syncFromView = function syncFromView(fabricObject, canvasPosition) {
			var type = shapeHelper.getTypeFromView(fabricObject);
			if (isTypeRegistered(type)) {
				var diff = registeredShapes[type].syncFromView(fabricObject, canvasPosition);

				return (isEmpty(diff)) ? undefined : diff;
			}

			return undefined;
		};

		this.syncFromModel = function syncFromModel(fabricObject, canvasPosition) {
			var type = shapeHelper.getTypeFromView(fabricObject);
			if (isTypeRegistered(type)) {
				registeredShapes[type].syncFromModel(fabricObject, canvasPosition);
			}
		};
	});
