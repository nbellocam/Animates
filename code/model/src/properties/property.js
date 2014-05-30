'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer');

/**
 *  Holds values and constraints and types.
 *  @class Represents a Property. 
 */
function Property (options) {
	var _self = this,
		defaultOptions = { 
			value : '',
			type : '',
			constraints : []
		},
		currentOptions;

	currentOptions = Common.extend(options || {}, defaultOptions);

	this.value = function (val) {
		if (arguments.length > 0) {
			currentOptions.value = val;
		} else {
			return currentOptions.value;
		}
	};

	/**
	 * Indicates wheter the current property or the value param is valid.
	 * @param {object} [value=undefined] - The value to validate.
	 */
	this.isValid = function isValid(value) {
		var valid = true,
			valueToValidate = arguments.length > 0 ? value : currentOptions.value;
		
		if (!currentOptions.type.isValid(valueToValidate)) {
			return false;
		}

		for (var i=0; i < currentOptions.constraints.length; i++) {
			if (!currentOptions.constraints[i](valueToValidate)) {
				return false;
			}
		}

		return valid;
	};

	this.parse = function parse (value) {
		currentOptions.value = currentOptions.type.parse(value);
	};
}

JsonSerializer.registerType(Property);

module.exports = Property;