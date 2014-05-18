'use strict';

angular.module('animatesApp')
	.service('timelineService', function timelineService($window, animationService) {
		var currentTick = 0,
			timeline = animationService.getInstance().timeline;
		
		return {
			addMediaObject : function addMediaObject(mediaObject){
				var mediaTimeline = timeline.addMediaObject(mediaObject);
				return mediaTimeline.getMediaFrameFor(currentTick);
			},
			removeMediaObject : function removeMediaObject(mediaObjectId){
				timeline.removeMediaObject(mediaObjectId);
			},
			getMediaFrame : function getMediaFrame(mediaObjectId){
				var mediaTimeline = timeline.getMediaTimeline(mediaObjectId);
				return mediaTimeline ? mediaTimeline.getMediaFrameFor(currentTick) : undefined;
			},
			getMediaFrames : function getMediaFrames(){
				return timeline.getElements(currentTick);
			},
			getMediaTimeline : function getMediaTimeline(mediaObjectId){
				return timeline.getMediaTimeline(mediaObjectId);
			},
			getMediaTimelines : function getMediaTimelines() {
				return timeline.getMediaTimelines();
			},
			setCurrentTick : function setCurrentTick(tick){
				currentTick = tick;
			},
			getCurrentTick : function getCurrentTick(){
				return currentTick;
			},
			startsAtCurrentTick : function startsAtCurrentTick(mediaTimeline){
				return mediaTimeline.getStartTick() === currentTick;
			}
		};
	});
