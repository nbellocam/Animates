'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape. 
 */
function Shape (options) {
	var _self = this,
		properties = options || {};
	
	this.VisualMediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Shape, VisualMediaObject, 'VisualMediaObject');

module.exports = Shape;
