'use strict';

var Type = require('./type'),
	manager;

	

/**
 *  Indicates vistualization options for MediaObjects properties.
 *  @class Represents an TypesManager. 
 */

function TypesManager (options) {
	var _self = this,
		types = {};

	this.registerType = function registerType (name, constraints, parent) {
		var options,
			type;

		options = {
			'name' : name,
			'constraints' : constraints
		};

		if (parent && types[parent]) {
			options.parentType = types[parent];
		}

		types[name] = new Type(options);
	};

	this.getType =  function (name) {
		return types[name];
	};
}

manager = new TypesManager();

function isInteger(value) {
    var n = ~~Number(value);
    return String(n) === value.toString();
}

function isFloat(value) {
	return !isNaN(value);
}

// Add default types
// TODO add constraints, separate to a different file
manager.registerType('integer', [ isInteger ]);
manager.registerType('float', [ isFloat ]);
manager.registerType('string', []);
manager.registerType('color', []);

module.exports = manager;