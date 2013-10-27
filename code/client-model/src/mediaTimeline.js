'use strict';

/**
 *  Creates a new media timeline.
 *  @class Represents a timeline for a media object. 
 */
function MediaTimeline (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		mediaObject = options.mediaObject,
		startFrame = options.startFrame || 0,
		endFrame = options.endFrame || -1,
		effects = {};


	/**
	 * Calculates the media object based on the original properties and the current frame.
	 * @param {integer} currentFrame The current frame.
	 */
	this.getMediaObjectFrameFor = function (currentFrame) {
		var mediaObjectFrame = {}; //TODO create a new mediaItemFrame (ex. shapeFrame) based on the mediaObject

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				mediaObjectFrame = effects[id].getPropertiesForFrame(currentFrame, mediaObjectFrame); //TODO order by endFrame in order to get the real result
			}
		}

		return mediaObjectFrame;
	};

	/**
	 * Get the start frame
	 * @return {integer} The number of the start frame.
	 */
	this.getStartFrame = function () {
		return startFrame;
	};

	/**
	 * Set the start frame for this media object
	 * @param {integer} newStartFrame The start frame for this media object.
	 */
	this.setStartFrame = function (newStartFrame) {
		startFrame = newStartFrame;
	};

	/**
	 * Calculates the end frame based on the effects and the configured end frame.
	 * @return {integer} The number of the end frame.
	 */
	this.getEndFrame = function () {
		var currentEndFrame = endFrame,
		i,
		effectEndFrame;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectEndFrame = effects[id].endFrame;
				if (effectEndFrame > currentEndFrame){
					currentEndFrame = effectEndFrame;
				}
			}
		}

		return currentEndFrame;
	};

	/**
	 * Set the end frame for this media object
	 * @param {integer} newEndFrame The end frame for this media object.
	 */
	this.setEndFrame = function (newEndFrame) {
		endFrame = newEndFrame;
	};

	/**
	 * Add a new effect to the media object timeline.
	 * @param {string} id        the id that identify the effect.
	 * @param {Effect} effect the effect that will be added.
	 */
	this.addEffect = function (id, effect){
		if (effect && id) {
			effects[id] = effect;
		}
	};

	/**
	 * Remove the effect from the media object timeline that correspond to the effectId
	 * @param  {string} effectId The id that was used when the effect was added.
	 */
	this.removeEffect = function (effectId){
		if (effectId) {
			delete effects[effectId];
		}
	};

	/**
	 * Return the collection of effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffects = function (){
		return effects;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

module.exports = MediaTimeline;
