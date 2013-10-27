/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

/**
 *  Creates a new ShapeTimeline.
 *  @class Represents a ShapeTimeline. 
 */
function ShapeTimeline (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		shape = options.shape,
		initialFrame = options.initialFrame || 0,
		endFrame = options.endFrame || -1,
		effects = {};


	/**
	 * Calculates the shape based on the original properties and the actual frame.
	 * @param {integer} frame The actual frame.
	 */
	this.getShapeFrameFor = function (currentFrame) {
		var mediaItemFrame = {}; //TODO create a new mediaItemFrame (ex. shapeFrame) based on the shape / mediaItem

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				mediaItemFrame = effects[id].getPropertiesForFrame(currentFrame, mediaItemFrame); //TODO order by endFrame in order to get the real result
			}
		}

		return mediaItemFrame;
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
	 * Calculates the end frame based on the effects and the configured end frame.
	 * @return {integer} The number of the end frame.
	 */
	this.getEndFrame = function () {
		var currentEndFrame = endFrame,
		i,
		effectEndFrame;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectEndFrame = effects[id].endFrame;
				if (effectEndFrame > currentEndFrame){
					currentEndFrame = effectEndFrame;
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
	 * Add a new effect to the shape timeline.
	 * @param {string} id        the id that identify the effect.
	 * @param {Effect} effect the effect that will be added.
	 */
	this.addEffect = function (id, effect){
		if (effect && id) {
			effects[id] = effect;
		}
	};

	/**
	 * Remove the effect from the shape timeline that correspond to the effectId
	 * @param  {string} effectId The id that was used when the effect was added.
	 */
	this.removeEffect = function (effectId){
		if (effectId) {
			delete effects[effectId];
		}
	};

	/**
	 * Return the collection of effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffects = function (){
		return effects;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

module.exports = ShapeTimeline;
