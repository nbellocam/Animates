'use strict';

/**
 *  Creates a new Timeline
 *  @class Represents a Timeline. 
 */
function Timeline (options) {
	var _self = this, // Save the this reference for later use
		mediaTimelineCollection = [];


	/**
	 * .
	 * @param {object} media object.
	 */
	this.addMediaObject = function (shape) {
		// TODO generate a new ShapeTimeline using the shape data.
	};

	/**
	 * .
	 * @param {integer} shapeId .
	 */
	this.removeShape = function (shapeId) {
	};

	/**
	 * Calculates all the elements for the current frame.
	 * @param {integer} currentFrame The current frame.
	 */
	this.getElementsForFrame = function (currentFrame) {
		var elements = [];
		
		for (var i = shapeTimelineCollection.length - 1; i >= 0; i--) {
			elements.push(shapeTimelineCollection[i].getShapeFrameFor(currentFrame));
		}

		return elements;
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());

}

module.exports = Timeline;