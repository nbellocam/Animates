'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	Effect = require('../effect.js');


/**
 *  Creates a new MoveEffect.
 *  @class Represents an MoveEffect .
 */
function MoveEffect(options) {
	options = options || {};

	this.base(options);

	var _self = this;

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			path = _self.getOption('path');

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

	this.getAffectedProperties = function () {
		return ['position'];
	};

	this.updateProperties = function (tick, updatedProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			changedProperties = [];

		if (tick >= startTick && tick <= endTick) {
			var positionX = updatedProperties['position.x'],
				positionY = updatedProperties['position.y'];

			if (positionX !== undefined || positionY !== undefined) {
				var path = _self.getOption('path');

				if (tick === _self.getOption('startTick')) {
					if (positionX !== undefined) {
						path.startPosition.x = positionX;
						changedProperties.push('position.x');
					}

					if (positionY !== undefined) {
						path.startPosition.y = positionY;
						changedProperties.push('position.y');
					}

					_self.setOption('path', path);
				} else if (tick === _self.getOption('endTick')) {
					if (positionX !== undefined) {
						path.endPosition.x = positionX;
						changedProperties.push('position.x');
					}

					if (positionY !== undefined) {
						path.endPosition.y = positionY;
						changedProperties.push('position.y');
					}

					_self.setOption('path', path);
				}
			}
		}

		return changedProperties;
	};

	this.effect_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.effect_toJSON();
	};

	(function init() {

	}());
}

Common.inherits(MoveEffect, Effect);

JsonSerializer.registerType(MoveEffect);

module.exports = MoveEffect;
