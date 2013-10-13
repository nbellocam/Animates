/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var Animates = Animates || {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new ShapeTimeline.
	 *  @class Represents a ShapeTimeline. 
	 */
	var ShapeTimeline = function (options) {
		options = options || {};
		
		var $this = this, // Save the this reference for later use
			shape = options.shape,
			initialFrame = options.initialFrame || 0,
			endFrame = options.endFrame || -1,
			animations = {};


		/**
		 * Calculates the shape based on the original properties and the actual frame.
		 * @param {integer} frame The actual frame.
		 */
		this.getShapeFrameFor = function (frame) {
		};

		/**
		 * Get the initial frame
		 * @return {number} The number of the initial frame.
		 */
		this.getInitialFrame = function () {
			return initialFrame;
		};

		/**
		 * Calculates the end frame based on the animations and the configured end frame.
		 * @return {number} The number of the end frame.
		 */
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

		this.setEndFrame = function (newEndFrame) {
			endFrame = newEndFrame;
		};

		this.addAnimation = function (id, animation){
			if (animation && id) {
				animations[id] = animation;
			}
		};

		this.removeAnimation = function (animationId){
			if (animationId) {
				delete animations[animationId];
			}
		};

		this.getAnimations = function (){
			return animations;
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

