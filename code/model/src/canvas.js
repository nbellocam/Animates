'use strict';

/**
 *  Creates a new Canvas.
 *  @class Represents a Canvas. 
 */
function Canvas (options) {
	var _self = this; // Save the this reference for later use

	this.height = options.height || 100;
	this.width = options.width || 100;
	this.backgroundColor = options.backgroundColor || 'white';
	this.backgroundImage = options.backgroundImage || '';

	/**
	 *  Constructor
	 */
	(function init() {
	}());
}

module.exports = Canvas;
