/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var Common = require('animates-common'),
	Effect = require('../effect.js');



/**
 *  Creates a new MoveEffect.
 *  @class Represents an MoveEffect . 
 */
function MoveEffect(options) {
	options = options || {};

	this.base(options);
	
	var _self = this,
		path = options.path;

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} frameNumber The actual frame.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getPropertiesForFrame = function (frameNumber, mediaFrameProperties) {
		var startFrameNumber = _self.startFrameNumber,
			endFrameNumber = _self.endFrameNumber;

		if (frameNumber > startFrameNumber){
			if (typeof path !== 'undefined' && typeof path.getPositionFor === 'function' ) {
				var currentPos;

				if (endFrameNumber === -1){
					currentPos = path.getPositionFor(startFrameNumber, endFrameNumber, frameNumber );
				} else {
					currentPos = path.getPositionFor(startFrameNumber, endFrameNumber, (frameNumber < endFrameNumber) ? frameNumber : endFrameNumber );
				}

				if (typeof currentPos.x !== 'undefined' ){
					mediaFrameProperties.position.x = currentPos.x;
				}

				if (typeof currentPos.y !== 'undefined' ){
					mediaFrameProperties.position.y = currentPos.y;
				}
			}
		}

		return mediaFrameProperties;
	};

	(function init() { 
		
	}());
}

Common.inherits(MoveEffect, Effect);

module.exports = MoveEffect;
