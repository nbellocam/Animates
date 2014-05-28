'use strict';

angular.module('animatesApp')
	.run(function rectangle(shapeCreator, shapeSync, toolbarService, shapeSyncHelper, shapeHelper) {
		var typeId = 'Rectangle';

		function createShape() {
			return new shapeSyncHelper.Fabric.Rect();
		}

		shapeCreator.registerShape(typeId, createShape);

		function syncFromModel(viewObject, canvasPosition){
			var model = shapeHelper.getMediaFrameFromView(viewObject);

			shapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);

			shapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
			shapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
		};

		function syncFromView(viewObject, canvasPosition){
			var diff = shapeSyncHelper.syncVisualMediaObjectFromView(viewObject, canvasPosition),
				mediaTimeline = shapeHelper.getMediaTimelineFromView(viewObject);

			if (shapeSyncHelper.startsAtCurrentTick(mediaTimeline)) {
				var mediaObject = mediaTimeline.getMediaObject();

				shapeSyncHelper.syncModelProperty(viewObject.currentHeight || viewObject.height, mediaObject, 'height', diff);
				shapeSyncHelper.syncModelProperty(viewObject.currentWidth || viewObject.width, mediaObject, 'width', diff);
			} else {
				// TODO: scale effect if properties changed
			}

			return diff;
		};

		shapeSync.registerShape(typeId, syncFromModel, syncFromView);

		function getButtonClass(){
			return 'fa fa-square-o';
		};

		function createMediaObject(){
			return new shapeSyncHelper.Model.Rectangle();
		};

		toolbarService.registerItem(typeId, getButtonClass, createMediaObject)
	});
