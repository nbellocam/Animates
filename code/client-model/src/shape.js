/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape. 
 */
function Shape (options) {
	var _self = this;

	this.VisualMediaObject(options); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Shape, VisualMediaObject, 'VisualMediaObject');

module.exports = Shape;
