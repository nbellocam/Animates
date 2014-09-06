'use strict';

angular.module('animatesPlayer')
	.run(function text(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
		var typeId = 'Text';

		function createShape() {
			var text = new playerShapeSyncHelper.Fabric.IText('Text');

			// lock x and y scaling to be consistent with the font type
			// fabric does not allow to change the height and width
			// directly you must do it by chaging the
			text.lockScalingY = true;
			text.lockScalingX = true;

			return text;
		}

		playerShapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject) {
			var model = playerShapeHelper.getMediaFrameFromView(viewObject);

			playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

			playerShapeSyncHelper.syncViewProperty(model.getProperty('fontSize'), viewObject, 'fontSize');
			playerShapeSyncHelper.syncViewProperty(model.getProperty('fontFamily'), viewObject, 'fontFamily');
			playerShapeSyncHelper.syncViewProperty(model.getProperty('fontStyle'), viewObject, 'fontStyle');
			playerShapeSyncHelper.syncViewProperty(model.getProperty('textDecoration'), viewObject, 'textDecoration');
			playerShapeSyncHelper.syncViewProperty(model.getProperty('text'), viewObject, 'text');
		};

		playerShapeSync.registerShape(typeId, syncFromModel);
	});
