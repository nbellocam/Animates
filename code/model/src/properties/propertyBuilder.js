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
			'name' : null,
			'strictValues' : []
		},
		_self = this,
		types = {};

	/**
	*  Constructor
	*/
	(function preInit() {
	}());


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

	this.strictValues = function (values) {
		options.strictValues = values;
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
			throw new Error("The property '" + options.name + "' could not be built because the type was not defined.");
		}

		// Add the constraint for the strictValues
		if (options.strictValues.length > 0) {
			options.constraints.push( function (val) {
				return (options.strictValues.indexOf(val) >= 0);
			});
		}

		property = new Property(options);

		if (property.isValid()) {
			return property;
		} else {
			throw new Error("The property '" + options.name + "' could not be built due to invalid value.");
		}
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = PropertyBuilder;
