'use strict';

var PropertyBuilder = require('./propertyBuilder'),
	CompositePropertyBuilder = require('./compositePropertyBuilder'),
	CompositeProperty = require('./compositeProperty'),
	DictionaryProperty = require('./dictionaryProperty');

/**
 *  Builds a dictionary of custom properties
 *  @class Represents an DictionaryPropertyBuilder. 
 */
function DictionaryPropertyBuilder () {
	var _self = this,
		name = '',
		currentValues = [],
		schemaBuilder;

	this.name = function (value) {
		name = value;
		return _self;
	};

	this.schema = function (BuilderClass) {
		schemaBuilder = new BuilderClass(_self);
		schemaBuilder.name('schema');

		schemaBuilder.add = function () {
			return _self;
		};
		return schemaBuilder;
	};

	this.values = function (values) {
		currentValues = values;
		return _self;
	};

	this.create = function () {
		var properties = new DictionaryProperty();
		properties.schema(schemaBuilder);

		for(var key in currentValues) {
			properties.setValue(key, currentValues[key]);
		}

		return properties;
	};
}

module.exports = DictionaryPropertyBuilder;