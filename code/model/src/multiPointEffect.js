'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('./properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	straightPathStrategy = require('./effects/pathStrategies/straightPathStrategy'),
	Effect = require('./effect.js');


/**
 *  Creates a new MultiPointEffect.
 *  @class Represents an MultiPointEffect .
 */
function MultiPointEffect(options, builder, pointsSchemaBuilder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'points' : {}
		},
		currentOptions,
		cachedPointsArray;

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		pointsSchemaBuilder = pointsSchemaBuilder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		propBuilder.property('points', DictionaryPropertyBuilder)
						.instancedSchema(pointsSchemaBuilder)
							.property('tick', PropertyBuilder)
								.type('float')
							.add()
						.add()
						.values(currentOptions.points)
					.add();

		_self.Effect(currentOptions, propBuilder);
	}());

	this.refreshPointsArray = function refreshPointsArray () {
		var pointsArray = [],
			points = _self.getOption('points');

		for (var key in points) {
			pointsArray.push(points[key]);
		}

		cachedPointsArray = pointsArray;
	};

	this.getPointsArray = function getPointsArray() {
		return cachedPointsArray;
	};

	this.addPoint = function addPoint(guid, tick, data) {
		var newPointData = { 'tick' : tick };

		for (var prop in data) {
			newPointData[prop] = data[prop];
		}

		_self.setOption('points.' + guid, newPointData);
		this.refreshPointsArray();
	};

	this.base_setOption = this.setOption;
	this.setOption = function (name, value) {
		if (name.slice(0,6) === 'points' && name.slice(-4) === 'tick') {
			// Check if a point exists in the same tick and then remove the old point.
			var points = _self.getOption('points'),
				pointId = name.slice(7).slice(0,-5);

			for (var key in points) {
				if (points[key].tick === value && key !== pointId) {
					// A point already exist in the same tick, remove it
					this.base_setOption('points.' + key , undefined);
				}
			}
		}

		this.base_setOption(name, value);
		_self.refreshPointsArray();
	};

	var baseFromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		baseFromJSON(json);
		_self.refreshPointsArray();
	};

	/**
	*  Constructor
	*/
	
	(function postInit() {
		_self.refreshPointsArray();
	}());
}

Common.inherits(MultiPointEffect, Effect, 'Effect');

JsonSerializer.registerType(MultiPointEffect);

module.exports = MultiPointEffect;
