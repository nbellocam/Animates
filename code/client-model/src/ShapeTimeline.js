/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

//var Animates = Animates || {};
var Animates = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new ShapeTimeline.
	 *  @class Represents a ShapeTimeline. 
	 */
	var ShapeTimeline = function (options) {
		var $this = this, // Save the this reference for later use
			shape = options.shape,
			initialFrame = options.initialFrame || 0,
			endFrame = options.endFrame || -1,
			animations = [];


		/**
		 * Calculates the shape based on the original properties and the actual frame.
		 * @param {integer} frame The actual frame.
		 */
		this.getShapeFrameFor = function (frame) {
		};

		this.getInitialFrame = function () {
			return initialFrame;
		};

		this.getEndFrame = function () {
			var currentEndFrame = endFrame,
			i,
			animationEndFrame;

			for (i = animations.length - 1; i >= 0; i--) {
				animationEndFrame = animations[i].endFrame;
				if (animationEndFrame > currentEndFrame){
					currentEndFrame = animationEndFrame;
				}
			}
			return currentEndFrame;
		};

		/**
		 *  Constructor
		 */ 
		(function init() {
		}());
	};

	ns.ShapeTimeline = ShapeTimeline;

}(Animates));


//Module export
module.exports = Animates.ShapeTimeline;

