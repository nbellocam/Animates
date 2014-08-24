'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	straightPathStrategy = require('./pathStrategies/straightPathStrategy'),
	MultiPointEffect = require('../multiPointEffect.js');


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
	(function preInit() {
		var pointsSchemaBuilder;

		propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		propBuilder.property('path', PropertyBuilder)
						.value(currentOptions.path)
						.type('string')
						.strictValues(['Straight'])
					.add();

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('position', CompositePropertyBuilder)
				.property('x', PropertyBuilder)
					.type('float')
				.add()
				.property('y', PropertyBuilder)
					.type('float')
				.add()
			.add();

		_self.MultiPointEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var	path = _self.getOption('path');

		if (path == 'Straight') {
			var newPosition = straightPathStrategy(tick, _self.getPointsArray());

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
		if (x === undefined || y === undefined) {
			var newPosition = straightPathStrategy(tick, _self.getPointsArray());

			if(x === undefined) {
				x = newPosition.x;
			}

			if(y === undefined) {
				y = newPosition.y;
			}
		}

		var data = {
						'position' : {
							'x' : x,
							'y' : y
						}
					};
		_self.addPoint(guid, tick, data);
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
						'updatedProperties' : ['position.y', 'position.x', 'MultiPointMoveEffect.newPoint']
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

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointMoveEffect, MultiPointEffect, 'MultiPointEffect');

JsonSerializer.registerType(MultiPointMoveEffect);

module.exports = MultiPointMoveEffect;
