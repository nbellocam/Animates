'use strict';

angular.module('animatesApp')
	.service('timelineService', function timelineService($window) {
		var model = $window.model,
			currentFrame = 0,
			timeline = new model.Timeline(); //TODO: review if this should be moved somewhere else
		
		return {
			addMediaObject : function addMediaObject(mediaObject){
				return timeline.addMediaObject(mediaObject);
			},
			getMediaFrames : function getMediaFrames(){
				return timeline.getElements(currentFrame);
			},
			getCurrentFrame : function getCurrentFrame(){
				return currentFrame;
			}
		};
	});
