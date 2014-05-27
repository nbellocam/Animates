'use strict';

var Common = require('animates-common'),
	Property = require('./property'),
	TypesManager = require('./typesManager');

/**
 *  Builds properties with constraints and values.
 *  @class Represents an PropertyBuilder. 
 */
function PropertyBuilder() {
	var options = {
			'constraints' : [],
			'value' : '',
			'type' : null,
			'name' : null
		},
		_self = this,
		types = {};


	this.name = function name(propName) {
		options.name = propName;
		return _self;
	};

	this.value = function value(propVal) {
		options.value = propVal;
		return _self;
	};

	this.type = function type (propType) {
		var currentType = TypesManager.getType(propType);
		if (currentType) {
			options.type = currentType;
		} else {
			throw new Error("The type '" + propType + "' is not registered");
		}
		return _self;
	};

	this.constraint = function constraint(propConstraint) {
		options.constraints.push(propConstraint);
		return _self;
	};

	this.create = function create () {
		var property;

		if (options.name === null) {
			throw new Error('The property could not be built because it does not have a name.');
		}
		
		if (options.type === null) {
			throw new Error('The property could not be built because the type was not defined.');
		}

		property = new Property(options);

		if (property.isValid()) {
			return property;
		} else {
			throw new Error('The property could not be built due to invalid value.');
		}
	};
}

module.exports = PropertyBuilder;
