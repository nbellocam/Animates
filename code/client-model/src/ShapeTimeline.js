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
		 * @return {integer} The number of the initial frame.
		 */
		this.getInitialFrame = function () {
			return initialFrame;
		};

		/**
		 * Set the initial frame for this shape
		 * @param {integer} newInitialFrame The initial frame for this shape.
		 */
		this.setInitialFrame = function (newInitialFrame) {
			initialFrame = newInitialFrame;
		};

		/**
		 * Calculates the end frame based on the animations and the configured end frame.
		 * @return {integer} The number of the end frame.
		 */
		this.getEndFrame = function () {
			var currentEndFrame = endFrame,
			i,
			animationEndFrame;

			for (var id in animations) {
				if (animations.hasOwnProperty(id)) {
					animationEndFrame = animations[id].endFrame;
					if (animationEndFrame > currentEndFrame){
						currentEndFrame = animationEndFrame;
					}
				}
			}

			return currentEndFrame;
		};

		/**
		 * Set the end frame for this shape
		 * @param {integer} newEndFrame The end frame for this shape.
		 */
		this.setEndFrame = function (newEndFrame) {
			endFrame = newEndFrame;
		};

		/**
		 * Add a new animation to the shape timeline.
		 * @param {string} id        the id that identify the animation.
		 * @param {Animation} animation the animation that will be added.
		 */
		this.addAnimation = function (id, animation){
			if (animation && id) {
				animations[id] = animation;
			}
		};

		/**
		 * Remove the animation from the shape timeline that correspond to the animationId
		 * @param  {string} animationId The id that was used when the animation was added.
		 */
		this.removeAnimation = function (animationId){
			if (animationId) {
				delete animations[animationId];
			}
		};

		/**
		 * Return the collection of animation.
		 * @return {Object} A dictionary with all the animations.
		 */
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

