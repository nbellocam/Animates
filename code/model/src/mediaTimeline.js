'use strict';

var MediaFrame = require('./mediaFrame'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Common = require('animates-common');

/**
 *  Creates a new media timeline.
 *  @class Represents a timeline for a media object.
 */
function MediaTimeline (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		mediaObject = options.mediaObject,
		effects = {};

	/**
	 * Calculates the media object based on the original properties and the current tick.
	 * @param {integer} currentTick The current tick.
	 */
	this.getMediaFrameFor = function getMediaFrameFor(currentTick) {
		var mediaObjectFrame = new MediaFrame({ 'mediaObject' : mediaObject, 'currentTick' : currentTick }),
			effectsArray = [],
			currentEffect;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectsArray.push(effects[id]);
			}
		}

		effectsArray.sort(function(a,b) {
			if (a.isInfinite() && b.isInfinite()) {
				return 0;
			} else if (a.isInfinite()) {
				return 1;
			} else if (b.isInfinite()) {
				return -1;
			} else {
				return b.getOption('endTick') - a.getOption('endTick');
			}
		});

		for (var i = effectsArray.length - 1; i >= 0; i--) {
			currentEffect = effectsArray[i];
			if (currentEffect.isInfinite()) {
					mediaObjectFrame.properties(currentEffect.getProperties(currentTick, mediaObjectFrame.properties()));
			} else {
				if (currentTick >= currentEffect.getOption('startTick')) {
					var effectEndTick = currentEffect.getOption('endTick'),
						endTick = (currentTick < effectEndTick) ? currentTick : effectEndTick;

					mediaObjectFrame.properties(
						currentEffect.getProperties(endTick,
								mediaObjectFrame.properties()));
				}
			}
		}

		return mediaObjectFrame;
	};

	/**
	 * Get the media object id
	 * @return {string} The media object id.
	 */
	this.getMediaObjectId = function getMediaObjectId() {
		return mediaObject.getGuid();
	};

	/**
	* Get the media object name
	* @return {string} The media object name.
	*/
	this.getMediaObjectName = function getMediaObjectName() {
		return mediaObject.getProperty('name');
	};

	/**
	 * Get the media object
	 * @return {string} The media object.
	 */
	this.getMediaObject = function getMediaObject() {
		return mediaObject;
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
				if (!currentEffect.isInfinite() && currentEffect.getOption('startTick') < upperTickLimit) {
					if (currentEffect.HasConflictWithProperties(effect)) {
						if (endTick < currentEffect.getOption('endTick')) {
							endTick = currentEffect.getOption('endTick');
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
				if (currentEffect.isInfinite() || (currentEffect.getOption('startTick') <= tick) && (currentEffect.getOption('endTick') >= tick)) {
					resultEffects.push(currentEffect);
				}
			}
		}

		return resultEffects;
	};

	/**
	* Gets the effects that contains the requested tick filtered by the ones that match any of the propertiesList
	* @param {integer} tick The tick that must be contained by the effects
	* @param {Array} tick propertiesList Array of effects that use to filter effects in current tick
	* @return {Array} The array of effects that contains the tick
	*/
	this.getEffectsForTickThatMatch = function (tick, propertiesList) {
		var effects = this.getEffectsForTick(tick),
			resultEffects = [];

		for (var i = 0; i < effects.length; i++) {
			if (effects[i].HasConflictWithListOfProperties(propertiesList)) {
				resultEffects.push(effects[i]);
			}
		}

		return resultEffects;
	};

	/**
	* Updates all effects that match the updated properties in the tick passed by parameter.
	* @param {integer} tick The tick that must be contained by the effects
	* @param {Map} updatedProperties Map of new properties updates that will be used to update all the effects
	* @return {Array} The not updated properties
	*/
	this.updateEffectsThatMatch = function (tick, updatedProperties) {
		var propertiesList = Common.getKeysFromObject(updatedProperties),
			effects = this.getEffectsForTickThatMatch(tick, propertiesList),
			updateResult,
			newProperty,
			newProperties = {};

		for (var i = 0; i < effects.length; i++) {
			updateResult = effects[i].updateProperties(tick, updatedProperties);

			propertiesList = Common.filterArray(propertiesList, updateResult.updatedProperties);

			if (updateResult.newProperties) {
				for(newProperty in updateResult.newProperties) {
					newProperties[newProperty] = updateResult.newProperties[newProperty];
				}
			}
		}

		return {
			pendingProperties: propertiesList,
			newProperties : newProperties
		};
	};

	/**
	 * Add a new effect to the media object timeline.
	 * @param {Effect} effect the effect that will be added.
	 */
	this.addEffect = function addEffect(effect) {
		if (effect) {
			effects[effect.getGuid()] = effect;
		}
	};

	/**
	 * Remove the effect from the media object timeline that correspond to the effectId
	 * @param  {string} effectId The id that was used when the effect was added.
	 */
	this.removeEffect = function removeEffect(effectId) {
		if (effectId) {
			delete effects[effectId];
		}
	};

	/**
	 * Return the effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffect = function getEffect(effectId) {
		return effects[effectId];
	};

	/**
	 * Return the collection of effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffects = function getEffects() {
		return effects;
	};

	this.toJSON = function () {
		var ser =	{
						'mediaObject' : JsonSerializer.serializeObject(mediaObject),
						'effects' : JsonSerializer.serializeDictionary(effects)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		mediaObject = JsonSerializer.deserializeObject(json.mediaObject);
		effects = JsonSerializer.deserializeDictionary(json.effects);
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());
}

JsonSerializer.registerType(MediaTimeline);

module.exports = MediaTimeline;
