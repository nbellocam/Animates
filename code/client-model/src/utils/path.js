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
	 * Calculates the new position based on the the currentFrameNumber, the start and end frames and the start and end position.
	 * @param {integer} frame The actual frame.
	 * @param {object} originalProperties The original properties.
	 */
	this.getPositionFor = function (startFrameNumber, endFrameNumber, currentFrameNumber) {
		if (startFrameNumber > currentFrameNumber){
			return {}; // The position can't be determined
		}

		if (endFrameNumber <= currentFrameNumber){
			return { x: _self.endPosition.x, y: _self.endPosition.y };		
		}

		var frameLength = endFrameNumber - startFrameNumber,
			// relativeCurrentFrameNumber = (currentFrameNumber - startFrameNumber),
			relativeFramePosition = (currentFrameNumber - startFrameNumber) / frameLength,
			startX = _self.startPosition.x,
			startY = _self.startPosition.y,
			//xTotalDelta = _self.endPosition.x - startX,
			xDelta = (_self.endPosition.x - startX) * relativeFramePosition,
			//yTotalDelta = _self.endPosition.y - startY,
			yDelta = (_self.endPosition.y - startY) * relativeFramePosition;

		return {x: startX + xDelta, y: startY + yDelta};
	};

	(function init() {
	}());
}

module.exports = Path;
