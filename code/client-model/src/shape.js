/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var MediaObject = require('./mediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape. 
 */
function Shape (options) {
	options = options || {};

	this.base(options); // Call base constructor

	var _self = this; // Save the this reference for later use

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Shape, MediaObject);

module.exports = Shape;
