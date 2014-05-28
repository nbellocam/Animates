'use strict';

var PropertyBuilder = require('./propertyBuilder');

/**
 *  Builds custom properties with specified types and constraints
 *  @class Represents an PropertiesArrayBuilder. 
 */
function PropertiesArrayBuilder () {
	var _self = this,
		properties = [];

	this.property = function (name) {
		var currentPropertyBuilder = new PropertyBuilder();
		
		currentPropertyBuilder.name(name);

		currentPropertyBuilder.add = function () {
			properties.push(currentPropertyBuilder.create());
			return _self;
		};

		return currentPropertyBuilder;
	};

	this.propertyArray = function (name) {
		return new PropertiesArrayBuilder ();
	};

	this.create = function () {
		return properties;
	};
}

module.exports = PropertiesArrayBuilder;