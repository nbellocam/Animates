'use strict';

angular.module('animatesApp')
	.run(function text(shapeCreator, shapeSync, toolbarService, shapeSyncHelper, shapeHelper) {
		var typeId = 'Text';

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

		function syncFromModel(viewObject, canvasPosition, initialCreation) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition, initialCreation);

			shapeSyncHelper.syncViewProperty(model.getProperty('fontSize'), viewObject, 'fontSize');
			shapeSyncHelper.syncViewProperty(model.getProperty('fontFamily'), viewObject, 'fontFamily');
			shapeSyncHelper.syncViewProperty(model.getProperty('fontStyle'), viewObject, 'fontStyle');
			shapeSyncHelper.syncViewProperty(model.getProperty('textDecoration'), viewObject, 'textDecoration');
			shapeSyncHelper.syncViewProperty(model.getProperty('text'), viewObject, 'text');
		};

		function syncFromView(viewObject, canvasPosition) {
			var diff = shapeSyncHelper.syncVisualMediaObjectFromView(viewObject, canvasPosition),
				mediaObject = shapeHelper.getMediaObjectFromView(viewObject);

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
			return new shapeSyncHelper.Model.Text();
		};

		toolbarService.registerItem(typeId, getButtonClass, createMediaObject)
	});
