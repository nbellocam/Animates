'use strict';

angular.module('animatesApp')
	.run(function triangle(shapeCreator, shapeSync, shapeSyncHelper, shapeHelper, canvasService) {
		var typeId = 'Photo';

		var oImg=document.createElement("img");
		oImg.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D');

		var imagesCache = {};

		function createShape(mediaObjectGuid) {
			var element = imagesCache[mediaObjectGuid];
			if (element){
				return new shapeSyncHelper.Fabric.Image(element);
			}

			return new shapeSyncHelper.Fabric.Image(oImg);
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject, canvasPosition) {
			var model = shapeHelper.getMediaFrameFromView(viewObject);
			if (model) {
				var source = model.getProperty('source');

				var element = viewObject.getElement();
				if (source && element.src !== source) {
					var newImageElement = document.createElement("img");
					newImageElement.onload = function () {
						imagesCache[shapeHelper.getGuidFromView(viewObject)] = newImageElement;
						viewObject.setElement(newImageElement);

						shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);

						shapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
						shapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
						viewObject.setCoords();
						canvasService.getInstance().renderAll();
					};
					newImageElement.setAttribute('src', source);
				} else {
					shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);

					shapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
					shapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
				}
			}
		};

		function syncFromView(viewObject, canvasPosition) {
			var diff = shapeSyncHelper.syncVisualMediaObjectFromView(viewObject, canvasPosition),
				mediaObject = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncModelProperty(viewObject.currentHeight || viewObject.height, mediaObject, 'height', diff, true);
			shapeSyncHelper.syncModelProperty(viewObject.currentWidth || viewObject.width, mediaObject, 'width', diff, true);

			return diff;
		};

		shapeSync.registerShape(typeId, syncFromModel, syncFromView);
	});
