'use strict';

var segmentHelper = require('./utils/segmentHelper');

/**
 *  Straigth path strategy
 */
function straightPathStrategy (currentTick, points) {

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
				'x' : segment.startPoint.position.x,
				'y' : segment.startPoint.position.y
			};
		}

		return getPositionFor(currentTick, segment.startPoint, segment.endPoint);
	} else if (points.length === 1 && currentTick >= points[0].tick) {
		return {
			'x' : points[0].position.x,
			'y' : points[0].position.y
		};
	}

	return {};
}

module.exports = straightPathStrategy;
