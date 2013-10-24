/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

/**
 *  Creates a new Path.
 *  @class Represents an Path . 
 */
function Path (options) {
	options = options || {};

	var _self = this; // Save the this reference for later use

	this.startPosition = options.startPosition || { x: 0, y:0 };

	this.endPosition = options.endPosition || { x: 0, y:0 };

	/**
	 * Calculates the new position based on the the currentFrame, the start and end frames and the start and end position.
	 * @param {integer} frame The actual frame.
	 * @param {object} originalProperties The original properties.
	 */
	this.getPositionFor = function (startFrame, endFrame, currentFrame) {
		if (startFrame > currentFrame){
			return {}; // The position can't be determined
		}

		if (endFrame <= currentFrame){
			return { x: _self.endPosition.x, y: _self.endPosition.y };		
		}

		var frameLength = endFrame - startFrame,
			xDelta = _self.endPosition.x - _self.startPosition.x,
			yDelta = _self.endPosition.y - _self.startPosition.y;

		return {x: xDelta * currentFrame / frameLength, y: yDelta * currentFrame / frameLength};
	};

	(function init() {
	}());
}

module.exports = Path;
