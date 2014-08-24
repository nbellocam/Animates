'use strict';

angular.module('animatesApp')
	.run(function circle(shapeCreator, shapeSync, toolbarShapeService, shapeSyncHelper, shapeHelper) {
		var typeId = 'Circle',
			objectNumber = 1;

		function createShape() {
			var shape = new shapeSyncHelper.Fabric.Circle();

			shape.setOptions({ 'lockUniScaling' : true });

			return shape;
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject, canvasPosition) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);

			shapeSyncHelper.syncViewProperty(model.getProperty('radius'), viewObject, 'radius');
		};

		function syncFromView(viewObject, canvasPosition) {
			var diff = shapeSyncHelper.syncVisualMediaObjectFromView(viewObject, canvasPosition),
				mediaObject = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncModelProperty((viewObject.currentHeight / 2 || viewObject.radius), mediaObject, 'radius', diff, true);

			return diff;
		};

		shapeSync.registerShape(typeId, syncFromModel, syncFromView);

		function getButtonClass() {
			return 'fa fa-circle-o';
		};

		function createMediaObject() {
			var options = {
				fill : '#7fdbe5',
				height: 100,
				width: 100,
				name: typeId + ' ' + objectNumber++
			};

			return new shapeSyncHelper.Model.Circle(options);
		};

		toolbarShapeService.registerItem(typeId, getButtonClass, createMediaObject)
	});
