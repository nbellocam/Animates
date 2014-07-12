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
		values = [],
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

	this.values = function (value) {
		values = value;
		return _self;
	};

	this.create = function () {
		var properties = new DictionaryProperty();
		properties.schema(schemaBuilder);

		for(var key in values) {
			var newProp = schemaBuilder.create().clone();
			newProp.valuesFromJSON(values[key]);
			properties.add(key, newProp);
		}

		return properties;
	};
}

module.exports = DictionaryPropertyBuilder;