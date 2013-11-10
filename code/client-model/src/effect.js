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

	this.startFrame = options.startFrame || 0;

	this.endFrame = options.endFrame || -1;

	/**
	 * Calculates the new shape properties based on the original ones and the actual frame.
	 * @param {integer} frame The actual frame.
	 * @param {object} originalProperties The original properties.
	 */
	this.getPropertiesForFrame = function (frame, beginShapeFrame) {
		return beginShapeFrame;
	};

	/**
	 * Gets the guid of the effect
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		guid = Common.createGuid();
	}());
}

module.exports = Effect;
