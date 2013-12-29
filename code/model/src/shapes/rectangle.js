/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = require('../shape'),
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

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

module.exports = Rectangle;
