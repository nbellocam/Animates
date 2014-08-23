'use strict';

var PropertyBuilder = require('./propertyBuilder'),
	DictionaryPropertyBuilder = require('./dictionaryPropertyBuilder'),
	PropertyBuilder = require('./propertyBuilder'),
	CompositeProperty = require('./compositeProperty');

/**
 *  Builds custom properties with specified types and constraints
 *  @class Represents an CompositePropertyBuilder.
 */
function CompositePropertyBuilder () {
	var _self = this,
		name = '',
		properties = new CompositeProperty();

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.name = function (arrayName) {
		name = arrayName;
	};

	this.property = function (name, BuilderClass) {
		var builder = new BuilderClass();
		builder.name(name);
		builder.add = function () {
			properties.add(name, builder.create());
			return _self;
		};
		return builder;
	};

	this.create = function () {
		return properties;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = CompositePropertyBuilder;
