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

		var startX = _self.startPosition.x,
			startY = _self.startPosition.y,
			endX = _self.endPosition.x,
			endY = _self.endPosition.y;

		if (endFrameNumber === -1){
			var frameDelta = currentFrameNumber - startFrameNumber,
				currentXPosition,
				currentYPosition,
				finalXPosition,
				finalYPosition;

			if (startX === endX){
				finalXPosition = startX;
			} else if (startX < endX){
				currentXPosition = startX + frameDelta;
				finalXPosition = currentXPosition >= endX ? endX : currentXPosition;
			} else {
				currentXPosition = startX - frameDelta;
				finalXPosition = currentXPosition <= endX ? endX : currentXPosition;
			}

			if (startY === endY){
				finalYPosition = startY;
			} else if (startY < endY){
				currentYPosition = startY + frameDelta;
				finalYPosition = currentYPosition >= endY ? endY : currentYPosition;
			} else {
				currentYPosition = startY - frameDelta;
				finalYPosition = currentYPosition <= endY ? endY : currentYPosition;
			}

			return { x: finalXPosition, y: finalYPosition };
		}

		if (endFrameNumber <= currentFrameNumber){
			return { x: endX, y: endY };		
		}

		var frameLength = endFrameNumber - startFrameNumber,
			// relativeCurrentFrameNumber = (currentFrameNumber - startFrameNumber),
			relativeFramePosition = (currentFrameNumber - startFrameNumber) / frameLength,
			//xTotalDelta = _self.endPosition.x - startX,
			xDelta = (endX - startX) * relativeFramePosition,
			//yTotalDelta = _self.endPosition.y - startY,
			yDelta = (endY - startY) * relativeFramePosition;

		return {x: startX + xDelta, y: startY + yDelta};
	};

	(function init() {
	}());
}

module.exports = Path;
