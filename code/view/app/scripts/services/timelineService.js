'use strict';

angular.module('animatesApp')
	.service('timelineService', function timelineService($window, animationService) {
		var currentTick = 0,
			timeline = null;
		
		function onAnimationLoad() {
			currentTick = 0;
			timeline = animationService.getInstance().timeline;
		}

		animationService.getInstance().addLoadCompleteObserver('TimelineService', onAnimationLoad);
		
		return {
			getMediaFrame : function getMediaFrame(mediaObjectId){
				var mediaTimeline = timeline ? timeline.getMediaTimeline(mediaObjectId) : undefined;
				return mediaTimeline ? mediaTimeline.getMediaFrameFor(currentTick) : undefined;
			},
			getMediaFrames : function getMediaFrames(){
				return timeline ? timeline.getElements(currentTick) : [];
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
