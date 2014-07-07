'use strict';

var segmentHelper = require('utils/segmentHelper');

/**
 *  Straigth path strategy
 */
function straigthPathStrategy (currentTick, points) {

	/**
	 * Calculates the new position based on the the currentTick, the start and end ticks and the start and end position.
	 * @param {integer} startTick The start tick number.
	 * @param {integer} endTick The end tick number.
	 * @param {integer} currentTick The current tick number.
	 * @returns {object} The postion {x, y} for the current tick
	 */
	function getPositionFor(currentTick, startPoint, endPoint) {
		var startX = startPoint.position.x,
			startY = startPoint.position.y,
			startTick = startPoint.tick,
			endX = endPoint.position.x,
			endY = endPoint.position.y,
			endTick = endPoint.tick;

		if (startTick > currentTick) {
			return {}; // The position can't be determined
		}

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
	}

	var segment = segmentHelper.getSegment(currentTick, points);

	if (segment && segment.startPoint) {
		if (!segment.endPoint) {
			return {
				'x' : segment.endPoint.position.x,
				'y' : segment.endPoint.position.y
			};
		}

		return getPositionFor(currentTick, segment.startPoint, segment.endPoint);
	}

	return {};
}

module.exports = straigthPathStrategy;
