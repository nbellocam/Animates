/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var Common = require('animates-common'),
	Effect = require('./effect.js');

'use strict';

/**
 *  Creates a new MoveEffect.
 *  @class Represents an MoveEffect . 
 */
function MoveEffect(options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
	path = options.path || { getPositionFor: function(startFrame, endFrame, currentFrame) { return { x:0, y:0 }; } };

	/**
	 * Calculates the new shape properties based on the original ones and the actual frame.
	 * @param {integer} frame The actual frame.
	 * @param {object} originalProperties The original properties.
	 */
	this.getPropertiesForFrame = function (frame, beginShapeFrame) {
		var currentPos = path.getPositionFor(startFrame, endFrame, frame);
		beginShapeFrame.x = currentPos.x;
		beginShapeFrame.y = currentPos.y;
		return beginShapeFrame;
	};

	(function init() { 
		_self.base(options); // Call base constructor
	}());
}

Common.inherits(MoveEffect, Effect);

module.exports = MoveEffect;
