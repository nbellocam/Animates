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

// Add default types
// TODO add constraints, separate to a different file
manager.registerType('integer', []);
manager.registerType('string', []);
manager.registerType('color', []);

module.exports = manager;