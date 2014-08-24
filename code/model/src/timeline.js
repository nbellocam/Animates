'use strict';

var MediaTimeline = require('./mediaTimeline'),
	MultiPointMoveEffect = require('./effects/multiPointMoveEffect'),
	MultiPointRotateEffect = require('./effects/multiPointRotateEffect'),
	MultiPointScaleEffect = require('./effects/multiPointScaleEffect'),
	MultiPointRadiusScaleEffect = require('./effects/multiPointRadiusScaleEffect'),
	MultiPointFontSizeScaleEffect = require('./effects/multiPointFontSizeScaleEffect'),
	MultiPointWidthAndHeightScaleEffect = require('./effects/multiPointWidthAndHeightScaleEffect'),
	JsonSerializer = require('./serialization/jsonSerializer');

/**
 *  Creates a new Timeline
 *  @class Represents a Timeline.
 */
function Timeline (options) {
	var _self = this,
		mediaTimelineCollection = [];

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	function addDefaultMoveEffect(mediaTimeline, mediaObject) {
		var defaultMoveEffect = new MultiPointMoveEffect();

		defaultMoveEffect.updateProperties(0, {
			'position.x' : mediaObject.getProperty('position.x'),
			'position.y' : mediaObject.getProperty('position.y')
		});

		mediaTimeline.addEffect(defaultMoveEffect);
	}

	function addDefaultRotateEffect(mediaTimeline, mediaObject) {
		var defaultRotateEffect = new MultiPointRotateEffect();

		defaultRotateEffect.updateProperties(0, {
			'angle' : mediaObject.getProperty('angle')
		});

		mediaTimeline.addEffect(defaultRotateEffect);
	}

	function createMultipointEffectInstance(scalableProperties) {
		if (scalableProperties.indexOf('radius') >= 0) {
			return new MultiPointRadiusScaleEffect();
		}

		if (scalableProperties.indexOf('fontSize') >= 0) {
			return new MultiPointFontSizeScaleEffect();
		}

		if (scalableProperties.indexOf('width') >= 0 && scalableProperties.indexOf('height') >= 0 ) {
			return new MultiPointWidthAndHeightScaleEffect();
		}
	}

	function addDefaultScaleEffect(mediaTimeline, mediaObject) {
		var scalableProperties = mediaObject.getScalableProperties && mediaObject.getScalableProperties(),
			scalableData = {};

		if (scalableProperties) {
			for (var i = 0; i < scalableProperties.length; i++) {
				scalableData[scalableProperties[i]] = mediaObject.getProperty(scalableProperties[i]);
			}

			if (scalableProperties.length > 0) {
				var defaultScaleEffect = createMultipointEffectInstance(scalableProperties);
				if (defaultScaleEffect) {
					defaultScaleEffect.updateProperties(0, scalableData);

					mediaTimeline.addEffect(defaultScaleEffect);
				}
			}
		}
	}

	/**
	 * Add a new media timeline element related
	 * @param {object} mediaTimeline the media timeline to be added.
	 * @return {object} The corresponding mediaTimeline object
	 */
	this.addMediaTimeline =  function addMediaTimeline(mediaTimeline) {
		if (mediaTimeline !== undefined) {
			mediaTimelineCollection.push(mediaTimeline);
			return mediaTimeline;
		}

		return undefined;
	};

	/**
	 * Add a new media timeline element related with the media object passed by parameter
	 * @param {object} mediaObject the media object to be added.
	 * @return {object} The corresponding mediaTimeline object
	 */
	this.addMediaObject = function addMediaObject(mediaObject) {
		// Generate a new MediaTimeline using the mediaObject data.
		if (mediaObject !== undefined) {
			var mediaTimeline,
				i,
				mediaObjectId = mediaObject.getGuid();

			for (i = mediaTimelineCollection.length - 1; i >= 0 && !mediaTimeline; i--) {
				if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId) {
					mediaTimeline = mediaTimelineCollection[i];
				}
			}

			if (!mediaTimeline) {
				mediaTimeline = new MediaTimeline({ mediaObject : mediaObject });

				addDefaultMoveEffect(mediaTimeline, mediaObject);
				addDefaultRotateEffect(mediaTimeline, mediaObject);
				addDefaultScaleEffect(mediaTimeline, mediaObject);

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
			if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId) {
				mediaTimelineCollection.splice(i, 1);
			}
		}
	};

	/**
	 * Returns the media timelines collection.
	 */
	this.getMediaTimelines = function getMediaTimelines() {
		return mediaTimelineCollection;
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
			if (current.getMediaObjectId() === mediaObjectId) {
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
	 * Calculates all the media frames for the current tick number.
	 * @param {integer} currentTick The current tick number.
	 * @return {MediaFrameArray} The media frames for the current tick number.
	 */
	this.getMediaFrames = function getMediaFrames(currentTick) {
		var elements = [], i;

		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			var mediaFrame = mediaTimelineCollection[i].getMediaFrameFor(currentTick);
			if (mediaFrame) {
				elements.push(mediaFrame);
			}
		}

		return elements;
	};

	/**
	 * Calculates the media frame for the current tick number.
	 * @param {integer} currentTick The current tick number.
	 * @param {string} mediaObjectId the id of the media object element that will be removed.
	 * @return {MediaFrameArray} The media frames for the current tick number.
	 */
	this.getMediaFrameFor = function getMediaFrame(mediaObjectId, currentTick) {
		var mediaTimeline = _self.getMediaTimeline(mediaObjectId);
		return mediaTimeline ? mediaTimeline.getMediaFrameFor(currentTick) : undefined;
	};

	this.toJSON = function toJSON() {
		var ser =	{
				'mediaTimelines' : JsonSerializer.serializeArray(mediaTimelineCollection)
			};

		return ser;
	};

	this.fromJSON = function fromJSON(json) {
		mediaTimelineCollection = JsonSerializer.deserializeArray(json.mediaTimelines);
	};

	/**
	 *  Constructor
	 */
	(function postInit() {
	}());

}

JsonSerializer.registerType(Timeline);

module.exports = Timeline;
