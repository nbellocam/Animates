'use strict';

var MediaTimeline = require('./mediaTimeline');

/**
 *  Creates a new Timeline
 *  @class Represents a Timeline. 
 */
function Timeline (options) {
	var _self = this,
		mediaTimelineCollection = [];

	/**
	 * Add a new media timeline element related with the media object passed by parameter
	 * @param {object} mediaObject the media object to be added.
	 */
	this.addMediaObject = function addMediaObject(mediaObject) {
		// Generate a new MediaTimeline using the mediaObject data.
		if (mediaObject !== undefined){
			var found = false,
				i,
				mediaObjectId = mediaObject.getGuid();

			for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
				if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId){
					found = true;
				}
			}

			if (!found){
				mediaTimelineCollection.push(new MediaTimeline({ mediaObject : mediaObject }));
			}
		}
	};

	/**
	 * Remove a media object element and its related media timeline.
	 * @param {string} mediaObjectId the id of the media object element that will be removed.
	 */
	this.removeMediaObject = function removeMediaObject(mediaObjectId) {
		var i;
		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId){
				mediaTimelineCollection.splice(i, 1);
			}
		}
	};

	/**
	 * Return the media timeline element related to the media object id passed by parameter
	 * @param  {string} mediaObjectId the if of the media object 
	 * @returns {MediaTimeline} the media timeline related to the media object id passed by parameter
	 */
	this.getMediaTimeline = function getMediaTimeline(mediaObjectId) {
		var current, i;

		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			current = mediaTimelineCollection[i];
			if (current.getMediaObjectId() === mediaObjectId){
				return current;
			}
		}

		return undefined;
	};

	/**
	 * Returns the amount of media timelines in this timeline
	 * @return {integer} The amount of media timelines in this timeline
	 */
	this.countMediaTimelines = function countMediaTimelines() {
		return mediaTimelineCollection.length;
	};

	/**
	 * Remove all the elements in the timeline
	 */
	this.clearAllElements = function clearAllElements() {
		mediaTimelineCollection.length = 0;
	};

	/**
	 * Calculates all the elements for the current tick number.
	 * @param {integer} currentTick The current tick number.
	 */
	this.getElements = function getElements(currentTick) {
		var elements = [], i;
		
		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			elements.push(mediaTimelineCollection[i].getMediaFrameFor(currentTick));
		}

		return elements;
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());

}

module.exports = Timeline;