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
			name : '',
			value : '',
			type : null,
			constraints : [],
			strictValues : []
		},
		currentOptions;

	currentOptions = Common.extend(options || {}, defaultOptions);

	this.value = function (val, avoidValidation) {
		if (arguments.length > 0) {
			if (avoidValidation) {
				currentOptions.value = val;
			} else {
				if (_self.isValid(val)) {
					currentOptions.value = val;
				} else {
					throw new Error('The value "' + val + '" is not valid for the property "' + _self.name() + '"');
				}
			}
		} else {
			return currentOptions.value;
		}
	};

	/**
	 * Indicates wheter the current property has a set of values that can take.
	 */
	this.isStrict = function isStrict() {
		return currentOptions.strictValues.length > 0;
	};

	this.strictValues = function strictValues () {
		return Common.clone(currentOptions.strictValues);
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

	this.name = function () {
		return currentOptions.name;
	};

	this.type = function type () {
		return currentOptions.type;
	};

	this.clone = function clone() {
		var newPropOp = Common.clone(currentOptions),
			newProp = new Property(newPropOp);

		return newProp;
	};
}

JsonSerializer.registerType(Property);

module.exports = Property;