'use strict';

angular.module('animatesApp')
	.service('timelineService', function timelineService($window) {
		var Model = $window.model,
			currentTick = 0,
			timeline = new Model.Timeline(); //TODO: review if this should be moved somewhere else
		
		return {
			addMediaObject : function addMediaObject(mediaObject){
				var mediaTimeline = timeline.addMediaObject(mediaObject);
				return mediaTimeline.getMediaFrameFor(currentTick);
			},
			removeMediaObject : function removeMediaObject(mediaObjectId){
				timeline.removeMediaObject(mediaObjectId);
			},
			getMediaFrames : function getMediaFrames(){
				return timeline.getElements(currentTick);
			},
			getMediaTimeline : function getMediaTimeline(mediaFrame){
				return timeline.getMediaTimeline(mediaFrame.getMediaObjectGuid());
			},
			getCurrentTick : function getCurrentTick(){
				return currentTick;
			},
			getDefaultStartTick : function getDefaultStartTick(){
				var defaultStartTick = currentTick - 10;
				return (defaultStartTick < 0) ? 0 : defaultStartTick;
			},
			startsAtCurrentTick : function startsAtCurrentTick(mediaTimeline){
				return mediaTimeline.getStartTick() === currentTick;
			},
			getMediaTimelines : function getMediaTimelines() {
				return timeline.getMediaTimelines();
			}
		};
	});
