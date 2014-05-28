'use strict';

var Type = require('./type');

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

module.exports = new TypesManager();