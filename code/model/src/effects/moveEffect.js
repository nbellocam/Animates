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

	this.updateProperties = function (tick, updatedPropertiesDiff) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			updatedProperties = [];

		if (tick >= startTick && tick <= endTick) {
			var positionX = updatedPropertiesDiff['position.x'],
				positionY = updatedPropertiesDiff['position.y'];

			if (positionX || positionY) {
				var path = _self.getOption('path');

				if (tick === _self.getOption('startTick')) {
					if (positionX) {
						path.startPosition.x = positionX.newValue;
						updatedProperties.push('position.x');
					}

					if (positionY) {
						path.startPosition.y = positionY.newValue;
						updatedProperties.push('position.y');
					}

					_self.setOption('path', path);
				} else if (tick === _self.getOption('endTick')) {
					if (positionX) {
						path.endPosition.x = positionX.newValue;
						updatedProperties.push('position.x');
					}

					if (positionY) {
						path.endPosition.y = positionY.newValue;
						updatedProperties.push('position.y');
					}

					_self.setOption('path', path);
				}
			}
		}

		return updatedProperties;
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
