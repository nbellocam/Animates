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

	this.isValid = function isValid() {
		var valid = true;
		
		if (!currentOptions.type.isValid(currentOptions.value)) {
			return false;
		}

		for (var i=0; i < currentOptions.constraints.length; i++) {
			if (!currentOptions.constraints[i](currentOptions.value)) {
				return false;
			}
		}

		return valid;
	};
}

JsonSerializer.registerType(Property);

module.exports = Property;