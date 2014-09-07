'use strict';

angular.module('animatesPlayer')
	.run(function rectangle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
		var typeId = 'Rectangle';

		function createShape() {
			return new playerShapeSyncHelper.Fabric.Rect();
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
