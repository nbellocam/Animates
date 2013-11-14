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

	this.base(options); // Call base constructor
	
	var _self = this, // Save the this reference for later use
		path = options.path;

	/**
	 * Calculates the new shape properties based on the original ones and the actual frame.
	 * @param {integer} frameNumber The actual frame.
	 * @param {object} originalProperties The original properties.
	 */
	this.getPropertiesForFrame = function (frameNumber, beginShapeFrame) {
		var startFrameNumber = _self.startFrameNumber,
			endFrameNumber = _self.endFrameNumber;
		
		if (frameNumber > startFrameNumber){
			if (typeof path !== 'undefined' && typeof path.getPositionFor === 'function' ) {
				var currentPos = path.getPositionFor(startFrameNumber, endFrameNumber, (frameNumber < endFrameNumber) ? frameNumber : endFrameNumber );

				if (typeof currentPos.x !== 'undefined' ){
					beginShapeFrame.x = currentPos.x;
				}

				if (typeof currentPos.y !== 'undefined' ){
					beginShapeFrame.y = currentPos.y;
				}
			}
		}

		return beginShapeFrame;
	};

	(function init() { 
		
	}());
}

Common.inherits(MoveEffect, Effect);

module.exports = MoveEffect;
