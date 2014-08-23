'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	MultiPointScaleEffect = require('./MultiPointScaleEffect.js'),
	segmentHelper = require('./utils/segmentHelper');


/**
 *  Creates a new MultiPointWidthAndHeightScaleEffect.
 *  @class Represents an MultiPointWidthAndHeightScaleEffect .
 */
function MultiPointWidthAndHeightScaleEffect(options, builder) {
	var _self = this,
		defaultOptions = {},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder,
			propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('height', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add()
			.property('width', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add();

		_self.MultiPointScaleEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	this.getScalablePropertiesNames = function () {
		return ['height', 'width'];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointWidthAndHeightScaleEffect, MultiPointScaleEffect, 'MultiPointScaleEffect');

JsonSerializer.registerType(MultiPointWidthAndHeightScaleEffect);

module.exports = MultiPointWidthAndHeightScaleEffect;
