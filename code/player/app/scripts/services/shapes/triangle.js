'use strict';

angular.module('animatesPlayer')
	.run(function triangle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
		var typeId = 'Triangle';

		function createShape() {
			return new playerShapeSyncHelper.Fabric.Triangle();
		}

		playerShapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject) {
			var model = playerShapeHelper.getMediaFrameFromView(viewObject);

			playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

			playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
			playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
		};

		playerShapeSync.registerShape(typeId, syncFromModel);
	});
