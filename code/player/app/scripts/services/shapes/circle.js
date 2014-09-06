'use strict';

angular.module('animatesPlayer')
	.run(function circle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
		var typeId = 'Circle';

		function createShape() {
			var shape = new playerShapeSyncHelper.Fabric.Circle();
			shape.setOptions({ 'lockUniScaling' : true });
			return shape;
		}

		playerShapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject) {
			var model = playerShapeHelper.getMediaFrameFromView(viewObject);

			playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

			playerShapeSyncHelper.syncViewProperty(model.getProperty('radius'), viewObject, 'radius');
		};

		playerShapeSync.registerShape(typeId, syncFromModel);
	});
