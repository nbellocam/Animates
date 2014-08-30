'use strict';

angular.module('animatesApp')
	.run(function rectangle(shapeCreator, shapeSync, shapeSyncHelper, shapeHelper) {
		var typeId = 'Rectangle';

		function createShape() {
			return new shapeSyncHelper.Fabric.Rect();
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
