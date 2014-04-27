'use strict';

var Common = require('animates-common');

/**
 *  Creates a new Effect.
 *  @class Represents an Effect .
 */
function Effect (options) {
	options = options || {};

	var _self = this,
		guid = ''; // Save the this reference for later use

	this.startTick = options.startTick || 0;

	this.endTick = options.endTick || -1;

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
		    return otherAffectedProperties.indexOf(n) != -1
		});
	};

	/**
	 *  Constructor
	 */
	(function init() {
		guid = Common.createGuid();
	}());
}

module.exports = Effect;
