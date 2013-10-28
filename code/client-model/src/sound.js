'use strict';

var MediaObject = require('./mediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Sound
 *  @class Represents a Sound. 
 */
function Sound (options) {
	var _self = this,
		defaultOptions = {
			volumen : 100,
			source : ''
		};

	options = Common.extend(defaultOptions, options);
	this.MediaObject(options); // Call base constructor

	/**
	 * Get the properties
	 * @return {Object} The current properties
	 */
	this.getProperties = function getProperties()
	{
		return options;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Sound, MediaObject, 'MediaObject');

module.exports = Sound;