'use strict';

angular.module('animatesPlayer')
	.factory('playerShapeHelper', function playerShapeHelper(playerAnimationService, playerLocalAnimationStateService) {
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
				return guid ? playerAnimationService.getInstance().timeline.getMediaTimeline(guid) : undefined;
			},
			getMediaObjectFromView = function getMediaObjectFromView(viewObject) {
				var mediaTimeline = getMediaTimelineFromView(viewObject);
				return mediaTimeline ? mediaTimeline.getMediaObject() : undefined;
			},
			getMediaFrameFromView = function getMediaFrameFromView(viewObject) {
				var mediaTimeline = getMediaTimelineFromView(viewObject);

				if (mediaTimeline) {
					return mediaTimeline.getMediaFrameFor(playerLocalAnimationStateService.getCurrentTick());
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

