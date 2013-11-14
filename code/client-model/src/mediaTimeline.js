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
		startFrameNumber = options.startFrameNumber || 0,
		endFrameNumber = options.endFrameNumber || -1,
		effects = {};


	/**
	 * Calculates the media object based on the original properties and the current frame.
	 * @param {integer} currentFrameNumber The current frame.
	 */
	this.getMediaFrameFor = function getMediaFrameFor(currentFrameNumber) {
		if (startFrameNumber <= currentFrameNumber){
			var mediaObjectFrame = new MediaFrame({ mediaObject: mediaObject, currentFrameNumber: currentFrameNumber }),
				effectsArray = [],
				currentEffect;

			for (var id in effects) {
				if (effects.hasOwnProperty(id)) {
					effectsArray.push(effects[id]);
				}
			}

			effectsArray.sort(function(a,b){
				return a.endFrameNumber - b.endFrameNumber;
			});
			
			for (var i = effectsArray.length - 1; i >= 0; i--) {
				currentEffect = effectsArray[i];
				if (currentFrameNumber > currentEffect.startFrameNumber){

					if (currentEffect.endFrameNumber === -1 ){
						mediaObjectFrame.properties(currentEffect.getPropertiesForFrame(currentFrameNumber, mediaObjectFrame.properties()));
					} else {
						mediaObjectFrame.properties(
							currentEffect.getPropertiesForFrame(
								(currentFrameNumber < currentEffect.endFrameNumber) ? currentFrameNumber : currentEffect.endFrameNumber,
								mediaObjectFrame.properties()
							)
						);
					}
				}
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
	this.getStartFrameNumber = function getStartFrameNumber() {
		return startFrameNumber;
	};

	/**
	 * Set the start frame for this media object
	 * @param {integer} newStartFrame The start frame for this media object.
	 */
	this.setStartFrameNumber = function setStartFrameNumber(newStartFrameNumber) {
		startFrameNumber = newStartFrameNumber;
	};

	/**
	 * Calculates the end frame based on the effects and the configured end frame.
	 * @return {integer} The number of the end frame.
	 */
	this.getEndFrameNumber = function getEndFrameNumber() {
		var currentEndFrameNumber = endFrameNumber,
		i,
		effectEndFrameNumber;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectEndFrameNumber = effects[id].endFrameNumber;
				if (effectEndFrameNumber > currentEndFrameNumber){
					currentEndFrameNumber = effectEndFrameNumber;
				}
			}
		}

		return currentEndFrameNumber;
	};

	/**
	 * Set the end frame for this media object
	 * @param {integer} newEndFrame The end frame for this media object.
	 */
	this.setEndFrameNumber = function setEndFrameNumber(newEndFrameNumber) {
		endFrameNumber = newEndFrameNumber;
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
