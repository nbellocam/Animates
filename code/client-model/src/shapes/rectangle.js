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
		defaultOptions = {
			height : 100,
			width : 100
		};

	options = Common.extend(defaultOptions, options);
	this.Shape(options); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

module.exports = Rectangle;
