'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	straightPathStrategy = require('./pathStrategies/straightPathStrategy'),
	Effect = require('../effect.js');


/**
 *  Creates a new MultiPointMoveEffect.
 *  @class Represents an MultiPointMoveEffect .
 */
function MultiPointMoveEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'path' : 'Straight',
			'points' : {}
		},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function init() {
		propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);
		currentOptions.startTick = 0;
		currentOptions.endTick = -1;

		propBuilder.property('path', PropertyBuilder)
						.value(currentOptions.path)
						.type('string')
						.constraint(function (val) { return (['Straight'].indexOf(val) >= 0); })
					.add()
					.property('points', DictionaryPropertyBuilder)
						.schema(CompositePropertyBuilder)
							.property('position', CompositePropertyBuilder)
								.property('x', PropertyBuilder)
									.type('float')
								.add()
								.property('y', PropertyBuilder)
									.type('float')
								.add()
							.add()
							.property('tick', PropertyBuilder)
								.type('float')
							.add()
						.add()
						.values(currentOptions.points)
					.add();

		_self.base(currentOptions, propBuilder);
	}());

	function getPointsArray() {
		var pointsArray = [],
			points = _self.getOption('points');

		for (var key in points) {
			pointsArray.push(points[key]);
		}

		return pointsArray;
	}

	this.base_setOption = this.setOption;
	this.setOption = function (name, value) {
		if ((name === 'startTick') || (name === 'endTick')) {
			throw new Error("The property '" + name + "' cannot be set.");
		} else {
			this.base_setOption(name, value);
		}
	};

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var	path = _self.getOption('path');

		if (path == 'Straight') {
			var newPosition = straightPathStrategy(tick, getPointsArray());

			if (newPosition && !mediaFrameProperties.hasOwnProperty('position')) {
				mediaFrameProperties.position = {};
			}

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
		return ['position.x', 'position.y'];
	};

	function addPoint(guid, tick, x, y) {
		var newPosition = {
								'tick' : tick,
								'position' : {
									'x' : x,
									'y' : y
								}
							};
		_self.setOption('points.' + guid, newPosition);
	}

	this.updateProperties = function (tick, updatedProperties) {
		var positionX = updatedProperties['position.x'],
			positionY = updatedProperties['position.y'],
			changedProperties = [],
			points;

		if (positionX === undefined && positionY === undefined) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointMoveEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			addPoint(newPoint.guid, tick, positionX, positionY);
			return	{
						'updatedProperties' : ['position.y', 'position.x']
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				if (positionX !== undefined) {
					_self.setOption('points.' + guid + '.position.x', positionX);
					changedProperties.push('position.x');
				}

				if (positionY !== undefined) {
					_self.setOption('points.' + guid + '.position.y', positionY);
					changedProperties.push('position.y');
				}
				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
		addPoint(newPointGuid, tick, positionX, positionY);
			return	{
						'updatedProperties' : ['position.y', 'position.x'],
						'newProperties' : {
							'MultiPointMoveEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid()}
						}
					};
	};

	this.effect_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.effect_toJSON();
	};
}

Common.inherits(MultiPointMoveEffect, Effect);

JsonSerializer.registerType(MultiPointMoveEffect);

module.exports = MultiPointMoveEffect;
