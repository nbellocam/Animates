'use strict';

angular.module('animatesApp')
	.run(function circle(shapeCreator, shapeSync, toolbarShapeService, shapeSyncHelper, shapeHelper) {
		var typeId = 'Circle';

		function createShape() {
			var shape = new shapeSyncHelper.Fabric.Circle();

			shape.setOptions({ 'lockUniScaling' : true });

			return shape;
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject, canvasPosition, initialCreation) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition, initialCreation);

			shapeSyncHelper.syncViewProperty(model.getProperty('radius'), viewObject, 'radius');
		};

		function syncFromView(viewObject, canvasPosition) {
			var diff = shapeSyncHelper.syncVisualMediaObjectFromView(viewObject, canvasPosition),
				mediaObject = shapeHelper.getMediaObjectFromView(viewObject);

			shapeSyncHelper.syncModelProperty((viewObject.currentHeight / 2 || viewObject.radius), mediaObject, 'radius', diff, true);

			return diff;
		};

		shapeSync.registerShape(typeId, syncFromModel, syncFromView);

		function getButtonClass() {
			return 'fa fa-circle-o';
		};

		function createMediaObject() {
			return new shapeSyncHelper.Model.Circle();
		};

		toolbarShapeService.registerItem(typeId, getButtonClass, createMediaObject)
	});
