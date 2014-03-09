'use strict';

angular.module('animatesApp')
	.service('timelineService', function timelineService($window) {
		var model = $window.model,
			currentFrame = 0,
			lastSelectedFrame = 0,
			timeline = new model.Timeline(); //TODO: review if this should be moved somewhere else
		
		return {
			addMediaObject : function addMediaObject(mediaObject){
				var mediaTimeline = timeline.addMediaObject(mediaObject);
				return mediaTimeline.getMediaFrameFor(currentFrame);
			},
			getMediaFrames : function getMediaFrames(){
				return timeline.getElements(currentFrame);
			},
			getMediaTimeline : function getMediaTimeline(mediaFrame){
				return timeline.getMediaTimeline(mediaFrame.getMediaObjectGuid());
			},
			getCurrentFrame : function getCurrentFrame(){
				return currentFrame;
			},
			getLastSelectedFrame : function getLastSelectedFrame(){
				return lastSelectedFrame;
			}
			startsAtCurrentFrame : function startsAtCurrentFrame(mediaTimeline){
				return mediaTimeline.getStartTick() === currentFrame;
			}
		};
	});
