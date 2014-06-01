'use strict';

var JsonSerializer = require('../serialization/jsonSerializer');


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
	 * Calculates the new position based on the the currentTick, the start and end ticks and the start and end position.
	 * @param {integer} startTick The start tick number.
	 * @param {integer} endTick The end tick number.
	 * @param {integer} currentTick The current tick number.
	 * @returns {object} The postion {x, y} for the current tick
	 */
	this.getPositionFor = function (startTick, endTick, currentTick) {
		if (startTick > currentTick) {
			return {}; // The position can't be determined
		}

		var startX = _self.startPosition.x,
			startY = _self.startPosition.y,
			endX = _self.endPosition.x,
			endY = _self.endPosition.y;

		if (endTick === -1) {
			var tickDelta = currentTick - startTick,
				currentXPosition,
				currentYPosition,
				finalXPosition,
				finalYPosition;

			if (startX === endX) {
				finalXPosition = startX;
			} else if (startX < endX) {
				currentXPosition = startX + tickDelta;
				finalXPosition = currentXPosition >= endX ? endX : currentXPosition;
			} else {
				currentXPosition = startX - tickDelta;
				finalXPosition = currentXPosition <= endX ? endX : currentXPosition;
			}

			if (startY === endY) {
				finalYPosition = startY;
			} else if (startY < endY) {
				currentYPosition = startY + tickDelta;
				finalYPosition = currentYPosition >= endY ? endY : currentYPosition;
			} else {
				currentYPosition = startY - tickDelta;
				finalYPosition = currentYPosition <= endY ? endY : currentYPosition;
			}

			return { x: finalXPosition, y: finalYPosition };
		}

		if (endTick <= currentTick) {
			return { 'x' : endX, 'y' : endY };
		}

		var ticksAmount = endTick - startTick,
			currentPathPercentage = (currentTick - startTick) / ticksAmount,
			xDelta = (endX - startX) * currentPathPercentage,
			yDelta = (endY - startY) * currentPathPercentage;

		return { 'x' : startX + xDelta, 'y' : startY + yDelta};
	};

  this.toJSON = function () {
    var ser =	{
            'startPosition' : JsonSerializer.serializeDictionary(_self.startPosition),
            'endPosition' : JsonSerializer.serializeDictionary(_self.endPosition)
          };

    return ser;
  };

	(function init() {
	}());
}


JsonSerializer.registerType(Path);

module.exports = Path;
