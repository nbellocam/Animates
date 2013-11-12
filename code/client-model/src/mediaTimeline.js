'use strict';

var MediaFrame = require('./mediaFrame');

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
	this.getMediaFrameFor = function getMediaFrameFor(currentFrame) {
		if (startFrame <= currentFrame){
			var mediaObjectFrame = new MediaFrame({ mediaObject: mediaObject, currentFrame: currentFrame }),
				effectsArray = [];

			for (var id in effects) {
				if (effects.hasOwnProperty(id)) {
					effectsArray.push(effects[id]);
				}
			}

			effectsArray.sort(function(a,b){
				return a.endFrame - b.endFrame;
			});
			
			for (var i = effectsArray.length - 1; i >= 0; i--) {
				
				mediaObjectFrame.properties(effectsArray[i].getPropertiesForFrame(currentFrame, mediaObjectFrame.properties()));
			}

			return mediaObjectFrame;
		}
		return undefined;
	};

	/**
	 * Get the media object id
	 * @return {string} The media object id.
	 */
	this.getMediaObjectId = function getMediaObjectId() {
		return mediaObject.getGuid();
	};

	/**
	 * Get the start frame
	 * @return {integer} The number of the start frame.
	 */
	this.getStartFrame = function getStartFrame() {
		return startFrame;
	};

	/**
	 * Set the start frame for this media object
	 * @param {integer} newStartFrame The start frame for this media object.
	 */
	this.setStartFrame = function setStartFrame(newStartFrame) {
		startFrame = newStartFrame;
	};

	/**
	 * Calculates the end frame based on the effects and the configured end frame.
	 * @return {integer} The number of the end frame.
	 */
	this.getEndFrame = function getEndFrame() {
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
	this.setEndFrame = function setEndFrame(newEndFrame) {
		endFrame = newEndFrame;
	};

	/**
	 * Add a new effect to the media object timeline.
	 * @param {Effect} effect the effect that will be added.
	 */
	this.addEffect = function addEffect(effect){
		if (effect) {
			effects[effect.getGuid()] = effect;
		}
	};

	/**
	 * Remove the effect from the media object timeline that correspond to the effectId
	 * @param  {string} effectId The id that was used when the effect was added.
	 */
	this.removeEffect = function removeEffect(effectId){
		if (effectId) {
			delete effects[effectId];
		}
	};

	/**
	 * Return the collection of effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffects = function getEffects(){
		return effects;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

module.exports = MediaTimeline;
