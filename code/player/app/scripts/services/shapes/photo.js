'use strict';

angular.module('animatesPlayer')
	.run(function triangle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper, playerCanvasService) {
		var typeId = 'Photo';

		var oImg=document.createElement("img");
		oImg.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D');

		var imagesCache = {};

		function createShape(mediaObjectGuid) {
			var element = imagesCache[mediaObjectGuid];
			if (element){
				return new playerShapeSyncHelper.Fabric.Image(element);
			}

			return new playerShapeSyncHelper.Fabric.Image(oImg);
		}

		playerShapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject) {
			var model = playerShapeHelper.getMediaFrameFromView(viewObject);
			if (model) {
				var source = model.getProperty('source');

				var element = viewObject.getElement();
				if (source && element.src !== source) {
					var newImageElement = document.createElement("img");
					newImageElement.onload = function () {
						imagesCache[playerShapeHelper.getGuidFromView(viewObject)] = newImageElement;
						viewObject.setElement(newImageElement);

						playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);

						playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
						playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
						viewObject.setCoords();
						playerCanvasService.getInstance().renderAll();
					};
					newImageElement.setAttribute('src', source);
				} else {
					playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);

					playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
					playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
				}
			}
		};

		playerShapeSync.registerShape(typeId, syncFromModel);
	});
