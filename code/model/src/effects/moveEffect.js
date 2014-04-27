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
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var startTick = _self.startTick,
			endTick = _self.endTick;

		if (tick >= startTick){
			if (typeof path !== 'undefined' && typeof path.getPositionFor === 'function' ) {
				var currentPos;

				if (endTick === -1){
					currentPos = path.getPositionFor(startTick, endTick, tick);
				} else {
					currentPos = path.getPositionFor(startTick, endTick, (tick < endTick) ? tick : endTick);
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

	this.getAffectedProperties = function () 
	{
		return ['position'];
	};

	(function init() { 
		
	}());
}

Common.inherits(MoveEffect, Effect);

module.exports = MoveEffect;
