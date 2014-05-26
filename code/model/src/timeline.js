'use strict';

var MediaTimeline = require('./mediaTimeline'),
	JsonSerializer = require('./serialization/jsonSerializer');

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
	 * @return {object} The corresponding mediaTimeline object
	 */
	this.addMediaObject = function addMediaObject(mediaObject) {
		// Generate a new MediaTimeline using the mediaObject data.
		if (mediaObject !== undefined){
			var mediaTimeline,
				i,
				mediaObjectId = mediaObject.getGuid();

			for (i = mediaTimelineCollection.length - 1; i >= 0 && !mediaTimeline; i--) {
				if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId){
					mediaTimeline = mediaTimelineCollection[i];
				}
			}

			if (!mediaTimeline){
				mediaTimeline = new MediaTimeline({ mediaObject : mediaObject });
				mediaTimelineCollection.push(mediaTimeline);
			}

			return mediaTimeline;
		}
		
		return undefined;
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
			var mediaFrame = mediaTimelineCollection[i].getMediaFrameFor(currentTick);
			if (mediaFrame){
				elements.push(mediaFrame);
			}
		}

		return elements;
	};

	/**
	 * Returns the media timelines collection.
	 */
	this.getMediaTimelines = function getMediaTimelines() {
		return mediaTimelineCollection;
	};

	this.toJSON = function () {
		var ser =	{
						'mediaTimelines' : JsonSerializer.serializeArray(mediaTimelineCollection)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		mediaTimelineCollection = JsonSerializer.deserializeArray(json.mediaTimelines);
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());

}

JsonSerializer.registerType(Timeline);

module.exports = Timeline;