'use strict';

angular.module('animatesApp')
	.service('timelineService', function timelineService($window) {
		var Model = $window.model,
			currentTick = 0,
			lastSelectedTick = 0,
			timeline = new Model.Timeline(); //TODO: review if this should be moved somewhere else
		
		return {
			addMediaObject : function addMediaObject(mediaObject){
				var mediaTimeline = timeline.addMediaObject(mediaObject);
				return mediaTimeline.getMediaFrameFor(currentTick);
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
			getLastSelectedTick : function getLastSelectedTick(){
				return lastSelectedTick;
			},
			startsAtCurrentTick : function startsAtCurrentTick(mediaTimeline){
				return mediaTimeline.getStartTick() === currentTick;
			}
		};
	});
