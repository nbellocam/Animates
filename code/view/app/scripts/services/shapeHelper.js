'use strict';

angular.module('animatesApp')
	.factory('shapeHelper', function shapeHelper(animationService, localAnimationStateService) {
		var getGuidFromView = function getGuidFromView(viewObject) {
				return viewObject && viewObject.model && viewObject.model.guid;
			},
			getTypeFromView = function getTypeFromView(viewObject) {
				return viewObject && viewObject.model && viewObject.model.type;
			},
			setModelInView = function setModelInView(modelObject, viewObject) {
				viewObject.model = {
					type: modelObject.getMediaObjectType() || modelObject.getType(),
					guid: modelObject.getMediaObjectGuid() || modelObject.getGuid()
				};
			},

			getMediaTimelineFromView = function getMediaTimelineFromView(viewObject) {
				var guid = getGuidFromView(viewObject);
				return guid ? animationService.getInstance().timeline.getMediaTimeline(guid) : undefined;
			},
			getMediaObjectFromView = function getMediaObjectFromView(viewObject) {
				var mediaTimeline = getMediaTimelineFromView(viewObject);
				return mediaTimeline ? mediaTimeline.getMediaObject() : undefined;
			},
			getMediaFrameFromView = function getMediaFrameFromView(viewObject) {
				var mediaTimeline = getMediaTimelineFromView(viewObject);

				if (mediaTimeline) {
					return mediaTimeline.getMediaFrameFor(localAnimationStateService.getCurrentTick());
				}

				return undefined;
			};
		
		return {
			getGuidFromView: getGuidFromView,
			getTypeFromView: getTypeFromView,
			setModelInView: setModelInView,

			getMediaTimelineFromView: getMediaTimelineFromView,
			getMediaObjectFromView: getMediaObjectFromView,
			getMediaFrameFromView: getMediaFrameFromView
		};
	});

