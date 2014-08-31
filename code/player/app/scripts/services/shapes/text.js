'use strict';

angular.module('animatesApp')
	.run(function text(shapeCreator, shapeSync, shapeSyncHelper, shapeHelper) {
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

		function syncFromModel(viewObject) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

			shapeSyncHelper.syncViewProperty(model.getProperty('fontSize'), viewObject, 'fontSize');
			shapeSyncHelper.syncViewProperty(model.getProperty('fontFamily'), viewObject, 'fontFamily');
			shapeSyncHelper.syncViewProperty(model.getProperty('fontStyle'), viewObject, 'fontStyle');
			shapeSyncHelper.syncViewProperty(model.getProperty('textDecoration'), viewObject, 'textDecoration');
			shapeSyncHelper.syncViewProperty(model.getProperty('text'), viewObject, 'text');
		};

		shapeSync.registerShape(typeId, syncFromModel);
	});
