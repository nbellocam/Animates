'use strict';

var Common = require('animates-common'),
	CompositeProperty = require('./compositeProperty');


function DictionaryProperty () {
	var _self = this,
		schema,
		proper;

	/**
	 *  Constructor
	 */
	(function init() {
		_self.base();
	}());

	this.schema = function (newSchema) {
		schema = newSchema;
	};
}

Common.inherits(DictionaryProperty, CompositeProperty);

module.exports = DictionaryProperty;