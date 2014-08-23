'use strict';

/**
 * Retrieves the startPoint and the endPoint given a tick and the list of points.
 * @param {integer} currentTick The current tick number.
 * @param {Array} points The array of points
 * @returns {object} The segment's start and end points {startPoint, endPoint} for the current tick
 */
function getSegment(currentTick, points) {
  if (points.length < 2) {
    return undefined;
  }

  var sortedPoints = points.sort(function comparePoints(pointA, pointB) {
    return pointA.tick - pointB.tick;
  });

  if (points[0].tick > currentTick) {
    return {
      endPoint : points[0]
    };
  }

  if (points[points.length - 1].tick <= currentTick) {
    return {
      startPoint : points[points.length - 1]
    };
  }

  for (var i = 1; i < points.length; i++) {
    if (points[i].tick >= currentTick) {
      return {
        startPoint : points[i - 1],
        endPoint : points[i]
      };
    }
  }
}

module.exports = {
  'getSegment' : getSegment
};
