'use strict';

/**
 *  Types have it own constraints and are usefull to validate properties values
 *  @class Represents a property types. 
 */
function Type (options) {
	var currentOptions = {
		'name' : '',
		'constraints' : [],
		'parentType' : null
	};

	this.name = function name (typeName) {
		currentOptions.name = typeName;
	};

	this.isValid = function isValid(value) {
		var valid = true;
		
		if (currentOptions.parentType) {
			if (!currentOptions.parentType.isValid(value)) {
				return false;
			}
		}

		for (var i=0; i < currentOptions.constraints.length; i++) {
			if (!currentOptions.constraints[i](value)) {
				return false;
			}
		}

		return valid;
	};

	if (options && options.constraints) {
		currentOptions.constraints.push.apply(currentOptions.constraints, options.constraints);
	}
}

module.exports = Type;