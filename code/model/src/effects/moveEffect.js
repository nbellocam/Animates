'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	straightPathStrategy = require('./pathStrategies/straightPathStrategy'),
	FiniteEffect = require('../finiteEffect.js');


/**
 *  Creates a new MoveEffect.
 *  @class Represents an MoveEffect .
 */
function MoveEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'path' : 'Straight',
			'startPosition' : { 'x' : 0, 'y' : 0},
			'endPosition' : { 'x' : 0, 'y' : 0}
		};

	/**
	 *  Constructor
	 */
	(function init() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('path', PropertyBuilder)
						.value(options.path)
						.type('string')
						.constraint(function (val) { return (['Straight'].indexOf(val) >= 0); })
					.add()
					.property('startPosition', CompositePropertyBuilder)
						.property('x', PropertyBuilder)
							.value(options.startPosition.x)
							.type('float')
						.add()
						.property('y', PropertyBuilder)
							.value(options.startPosition.y)
							.type('float')
						.add()
					.add()
					.property('endPosition', CompositePropertyBuilder)
						.property('x', PropertyBuilder)
							.value(options.endPosition.x)
							.type('float')
						.add()
						.property('y', PropertyBuilder)
							.value(options.endPosition.y)
							.type('float')
						.add()
					.add();

		_self.FiniteEffect(options, propBuilder);
	}());

	function getPointsArray() {
		return [
			{
				position : _self.getOption('startPosition'),
				tick : _self.getOption('startTick')
			},
			{
				position : _self.getOption('endPosition'),
				tick : _self.getOption('endTick')
			}
		];
	}

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var	path = _self.getOption('path');

		if (path == 'Straight') {
			var newPosition = straightPathStrategy(tick, getPointsArray());

			for (var key in newPosition) {
				if (newPosition.hasOwnProperty(key)) {
					mediaFrameProperties.position[key] = newPosition[key];
				}
			}

			return mediaFrameProperties;
		}

		throw new Error('Invalid path property');
	};

	this.getAffectedProperties = function () {
		return ['position'];
	};

	this.updateProperties = function (tick, updatedProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			positionX = updatedProperties['position.x'],
			positionY = updatedProperties['position.y'],
			changedProperties = [];

		if (positionX === undefined && positionY === undefined) {
			return { updatedProperties: changedProperties };
		}

		if (tick === startTick) {
			if (positionX !== undefined) {
				_self.setOption('startPosition.x', positionX);
				changedProperties.push('position.x');
			}

			if (positionY !== undefined) {
				_self.setOption('startPosition.y', positionY);
				changedProperties.push('position.y');
			}
		}

		if (tick === endTick) {
			if (positionX !== undefined) {
				_self.setOption('endPosition.x', positionX);
				changedProperties.push('position.x');
			}

			if (positionY !== undefined) {
				_self.setOption('endPosition.y', positionY);
				changedProperties.push('position.y');
			}
		}

		return { updatedProperties: changedProperties };
	};

	/*this.effect_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.effect_toJSON();
	};*/
}

Common.inherits(MoveEffect, FiniteEffect, 'FiniteEffect');

JsonSerializer.registerType(MoveEffect);

module.exports = MoveEffect;
