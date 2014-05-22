/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = require('../shape'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	Common = require('animates-common');

/**
 *  Creates a new Rectangle
 *  @class Represents a Rectangle. 
 */
function Rectangle (options) {
	var _self = this,
		defaultProperties = {
			height : 100,
			width : 100
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.Shape(properties); // Call base constructor

	this.shape_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.shape_toJSON();
	};

	this.shape_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.shape_fromJSON(json);
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

JsonSerializer.registerType(Rectangle);

module.exports = Rectangle;
