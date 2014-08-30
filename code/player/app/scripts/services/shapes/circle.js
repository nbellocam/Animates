'use strict';

angular.module('animatesApp')
	.run(function circle(shapeCreator, shapeSync, shapeSyncHelper, shapeHelper) {
		var typeId = 'Circle';

		function createShape() {
			var shape = new shapeSyncHelper.Fabric.Circle();
			shape.setOptions({ 'lockUniScaling' : true });
			return shape;
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

			shapeSyncHelper.syncViewProperty(model.getProperty('radius'), viewObject, 'radius');
		};

		shapeSync.registerShape(typeId, syncFromModel);
	});
