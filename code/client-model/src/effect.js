/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

/**
 *  Creates a new Effect.
 *  @class Represents an Effect . 
 */
function Effect (options) {
	options = options || {};

	var _self = this; // Save the this reference for later use

	this.startFrame = options.startFrame || 0;

	this.endFrame = options.endFrame || -1;

	/**
	 * Calculates the new shape properties based on the original ones and the actual frame.
	 * @param {integer} frame The actual frame.
	 * @param {object} originalProperties The original properties.
	 */
	this.getPropertiesForFrame = function (frame, beginShapeFrame) {
		//var shapeFrame = ns.clone (beginShapeFrame)
		//return $this.updateFrame (shapeFrame); --> template method
		return beginShapeFrame; //This should be a copy
	};

	(function init() {
	}());
}

module.exports = Effect;
