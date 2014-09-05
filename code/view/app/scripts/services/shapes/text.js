'use strict';

angular.module('animatesEditor')
	.run(function text(shapeCreator, shapeSync, toolbarShapeService, shapeSyncHelper, shapeHelper) {
		var typeId = 'Text',
			objectNumber = 1;

		function createShape() {
			var text = new shapeSyncHelper.Fabric.IText('Text');

			// lock x and y scaling to be consistent with the font type
			// fabric does not allow to change the height and width
			// directly you must do it by chaging the
			text.lockScalingY = true;
			text.lockScalingX = true;

			return text;
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject, canvasPosition) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);

			shapeSyncHelper.syncViewProperty(model.getProperty('fontSize'), viewObject, 'fontSize');
			shapeSyncHelper.syncViewProperty(model.getProperty('fontFamily'), viewObject, 'fontFamily');
			shapeSyncHelper.syncViewProperty(model.getProperty('fontStyle'), viewObject, 'fontStyle');
			shapeSyncHelper.syncViewProperty(model.getProperty('textDecoration'), viewObject, 'textDecoration');
			shapeSyncHelper.syncViewProperty(model.getProperty('text'), viewObject, 'text');
		};

		function syncFromView(viewObject, canvasPosition) {
			var diff = shapeSyncHelper.syncVisualMediaObjectFromView(viewObject, canvasPosition),
				mediaObject = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncModelProperty(viewObject.fontSize || viewObject.fontSize, mediaObject, 'fontSize', diff, true);
			shapeSyncHelper.syncModelProperty(viewObject.fontFamily || viewObject.fontFamily, mediaObject, 'fontFamily', diff, false);
			shapeSyncHelper.syncModelProperty(viewObject.fontStyle || viewObject.fontStyle, mediaObject, 'fontStyle', diff, false);
			shapeSyncHelper.syncModelProperty(viewObject.textDecoration || viewObject.textDecoration, mediaObject, 'textDecoration', diff, false);
			shapeSyncHelper.syncModelProperty(viewObject.text || viewObject.text, mediaObject, 'text', diff, false);

			return diff;
		};

		shapeSync.registerShape(typeId, syncFromModel, syncFromView);

		function getButtonClass() {
			return 'fa fa-font';
		};

		function createMediaObject() {
			var options = {
				fill : '#000000',
				name: typeId + ' ' + objectNumber++
			};

			return new shapeSyncHelper.Model.Text(options);
		};

		toolbarShapeService.registerItem(typeId, getButtonClass, createMediaObject)
	});
