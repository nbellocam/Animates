'use strict';

var PropertyBuilder = require('./propertyBuilder'),
	CompositeProperty = require('./compositeProperty');

/**
 *  Builds custom properties with specified types and constraints
 *  @class Represents an CompositePropertyBuilder. 
 */
function CompositePropertyBuilder () {
	var _self = this,
		name = '',
		properties = new CompositeProperty();

	this.name = function (arrayName) {
		name = arrayName;
	};

	this.property = function (name) {
		var currentPropertyBuilder = new PropertyBuilder();
		
		currentPropertyBuilder.name(name);

		currentPropertyBuilder.add = function () {
			properties.add(name, currentPropertyBuilder.create());
			return _self;
		};

		return currentPropertyBuilder;
	};

	this.propertyArray = function (name) {
		var currentPropertyArrayBuilder = new CompositePropertyBuilder();

		currentPropertyArrayBuilder.add = function () {
			properties.add(name, currentPropertyArrayBuilder.create());
			return _self;
		};

		return currentPropertyArrayBuilder;
	};

	this.create = function () {
		return properties;
	};
}

module.exports = CompositePropertyBuilder;