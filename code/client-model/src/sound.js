'use strict';

var MediaObject = require('./mediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Sound
 *  @class Represents a Sound. 
 */
function Sound (options) {
	var _self = this,
		defaultProperties = {
			volumen : 100,
			source : ''
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.MediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Sound, MediaObject, 'MediaObject');

module.exports = Sound;