'use strict';

angular.module('animatesPlayer')
	.run(function triangle(shapeCreator, shapeSync, shapeSyncHelper, shapeHelper) {
		var typeId = 'Triangle';

		function createShape() {
			return new shapeSyncHelper.Fabric.Triangle();
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

			shapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
			shapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
		};

		shapeSync.registerShape(typeId, syncFromModel);
	});
