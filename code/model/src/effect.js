'use strict';

var Common = require('animates-common');

/**
 *  Creates a new Effect.
 *  @class Represents an Effect .
 */
function Effect (options) {
	
	options = options || {};

	var _self = this,
		guid = '',
		defaultOptions = {
			startTick : 0,
			endTick : -1
		},
		currentOptions = {};

	/**
	 * Calculates the new shape properties based on the original ones and the current tick.
	 * @param {integer} tick The current tick number.
	 * @param {object} originalProperties The original properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		return mediaFrameProperties;
	};

	/**
	 * Gets the guid of the effect
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getAffectedProperties = function () 
	{
		return [];
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getCommonAffectedProperties = function (effect) {
		var currentAffectedProperties = this.getAffectedProperties(),
			otherAffectedProperties = effect.getAffectedProperties();

		return currentAffectedProperties.filter(function(n) {
			return otherAffectedProperties.indexOf(n) != -1;
		});
	};

	/**
	 * Detects if the current effect change some of the properties of the requested 
	 * effects also changes
	 * If the strict parameter is passed as true then all the properties must match
	 * 
	 * @param {Effect} effect The effect on which conflicts must be checked
	 * @param {boolean} strict means that all properties must match to indicate a conflict
	 * @return true if a match was found (according to the strict paramter)
	 */
	this.HasConflictWithProperties = function (effect, strict) {
		// Check for all properties to indicate a conflict
		var currentAffectedProperties = this.getAffectedProperties(),
			otherAffectedProperties = effect.getAffectedProperties();

		if (strict) {
			if (currentAffectedProperties.length == otherAffectedProperties.length) {
				for (var i = 0; i < currentAffectedProperties.length; i++) {
					if ((otherAffectedProperties.indexOf(currentAffectedProperties[i])) == -1)
					{
						return false;
					}
				}

				return true;
			} else {
				return false;
			}
		} else {
			return this.getCommonAffectedProperties(effect).length > 0;
		}
	};

	this.getOption = function (name) {
		return currentOptions[name];
	};

	this.setOption = function (name, value) {
		currentOptions[name] = value;
	};

	this.getOptions = function () {
		return Common.clone(currentOptions);
	};

	this.setOptions = function (options) {
		for(var name in options) {
			_self.setOption(name, options[name]);
		}
	};

	/**
	 *  Constructor
	 */
	(function init() {
		currentOptions = Common.extend(options || {}, defaultOptions),
		guid = Common.createGuid();
	}());
}

module.exports = Effect;
