'use strict';

var Common = require('animates-common');

/**
 *  Types have it own constraints and are usefull to validate properties values
 *  @class Represents a property types. 
 */
function Type (options) {
	var defaultOptions = {
		'name' : '',
		'constraints' : [],
		'parentType' : null
	}, 
	currentOptions;

	this.name = function name () {
		return currentOptions.name;
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

	/**
	 *  Constructor
	 */
	(function init() {
		currentOptions = Common.extend(options || {}, defaultOptions);
	}());
}

module.exports = Type;