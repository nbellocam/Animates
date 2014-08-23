'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	MultiPointScaleEffect = require('./multiPointScaleEffect.js'),
	segmentHelper = require('./utils/segmentHelper');


/**
 *  Creates a new MultiPointRadiusScaleEffect.
 *  @class Represents an MultiPointRadiusScaleEffect .
 */
function MultiPointRadiusScaleEffect(options, builder) {
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
			.property('radius', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add();

		_self.MultiPointScaleEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	this.getScalablePropertiesNames = function () {
		return ['radius'];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointRadiusScaleEffect, MultiPointScaleEffect, 'MultiPointScaleEffect');

JsonSerializer.registerType(MultiPointRadiusScaleEffect);

module.exports = MultiPointRadiusScaleEffect;
