/*global window, fabric, $ */

var Animates = Animates || {};

(function (ns){

	/**
	 *	Creates a new Timeline
	 *  @class Represents a Timeline. 
	 */ 
	var Timeline = function (options) 
	{
		var $this = this, // Save the this reference for later use
			shapeTimelineCollection = [];


		/**
		 * .
		 * @param {object} shape .
		 */
		this.addShape = function (shape) 
		{
			// TODO generate a new ShapeTimeline using the shape data.
		};

		/**
		 * .
		 * @param {integer} shapeId .
		 */
		this.removeShape = function (shapeId) 
		{
		};

		/**
		 *	Constructor
		 */ 
		(function init() {
		})();

	};

	ns.Timeline = Timeline;

})(Animates);

