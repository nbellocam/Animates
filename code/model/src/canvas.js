'use strict';

/**
 *  Creates a new Canvas.
 *  @class Represents a Canvas. 
 */
function Canvas (options) {
	options = options || {};
	
	var _self = this; // Save the this reference for later use

	this.height = options.height || 100;
	this.width = options.width || 100;
	this.backgroundColor = options.backgroundColor || 'white';
	this.backgroundImage = options.backgroundImage || '';


	this.filterDrawables = function filterDrawables(mediaFrames){
		return mediaFrames; //TODO filter media frames
	};
	
	/**
	 *  Constructor
	 */
	(function init() {
	}());
}

module.exports = Canvas;
