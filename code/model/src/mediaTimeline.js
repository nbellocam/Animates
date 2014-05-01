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
		startTick = options.startTick || 0,
		endTick = options.endTick || -1,
		effects = {};

	/**
	 * Calculates the media object based on the original properties and the current tick.
	 * @param {integer} currentTick The current tick.
	 */
	this.getMediaFrameFor = function getMediaFrameFor(currentTick) {
		if (startTick <= currentTick){
			var mediaObjectFrame = new MediaFrame({ 'mediaObject' : mediaObject, 'currentTick' : currentTick }),
				effectsArray = [],
				currentEffect;

			for (var id in effects) {
				if (effects.hasOwnProperty(id)) {
					effectsArray.push(effects[id]);
				}
			}

			effectsArray.sort(function(a,b){
				return b.endTick - a.endTick;
			});
			
			for (var i = effectsArray.length - 1; i >= 0; i--) {
				currentEffect = effectsArray[i];
				if (currentTick >= currentEffect.startTick){
					if (currentEffect.endTick === -1 ){
						mediaObjectFrame.properties(currentEffect.getProperties(currentTick, mediaObjectFrame.properties()));
					} else {
						mediaObjectFrame.properties(
							currentEffect.getProperties(
								(currentTick < currentEffect.endTick) ? currentTick : currentEffect.endTick,
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
	 * Get the media object
	 * @return {string} The media object.
	 */
	this.getMediaObject = function getMediaObject() {
		return mediaObject;
	};

	/**
	 * Get the start tick
	 * @return {integer} The number of the start tick.
	 */
	this.getStartTick = function getStartTick() {
		return startTick;
	};

	/**
	 * Set the start tick for this media object
	 * @param {integer} tick The start tick for this media object.
	 */
	this.setStartTick = function setStartTick(tick) {
		startTick = tick;
	};

	/**
	 * Calculates the end tick based on the effects and the configured end tick.
	 * @return {integer} The number of the end tick.
	 */
	this.getEndTick = function getEndTick() {
		var currentEndTick = endTick,
			effectEndTick;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectEndTick = effects[id].endTick;
				if (effectEndTick > currentEndTick){
					currentEndTick = effectEndTick;
				}
			}
		}

		return currentEndTick;
	};

	/**
	 * Finds the most suitable start tick for the requested effect considering all 
	 * effects thay may change the same requested properties before it.
	 * @param {Array} affectedProperties The properties to be considered during the search of effects
	 * @param {integer} upperTickLimit Upper limit tick to look for effects. Effects that starts 
	 * after this tick may not be considered
	 * @return {integer} the start tick
	 */
	this.getStartTickFor = function getStartTickFor (effect, upperTickLimit) {
		var endTick = 0;

		// up to now for us there is no effect that conflicts with the requested properties

		// Look for effects in the media timeline
		var effects = this.getEffects();
		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				var currentEffect = effects[id];

				// Only consider effects that start before the upperLimitTick
				if (currentEffect.startTick < upperTickLimit){
					if (currentEffect.HasConflictWithProperties(effect)) {
						if (endTick < currentEffect.endTick) {
							endTick = currentEffect.endTick;
						}
					}
				}
			}
		}

		return endTick;
	};

	/**
	 * Gets the effects that contains the requested tick
	 * @param {integer} tick The tick that must be contained by the effects
	 * @return {Array} The array of effects that contains the tick
	 */
	this.getEffectsForTick = function (tick) {
		var effects = this.getEffects(),
			resultEffects = [];

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				var currentEffect = effects[id];

				// If the effect contains the tick
				if ((currentEffect.startTick < tick) && (currentEffect.endTick > tick)) {
					resultEffects.push(currentEffect);
				}
			}
		}

		return resultEffects;
	};

	/**
	 * Set the end tick for this media object
	 * @param {integer} tick The end tick for this media object.
	 */
	this.setEndTick = function setEndTick(tick) {
		endTick = tick;
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
