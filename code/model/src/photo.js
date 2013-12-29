/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Photo
 *  @class Represents a Photo. 
 */
function Photo (options) {
	var _self = this,
		defaultProperties = {
			source : ''
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.VisualMediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Photo, VisualMediaObject, 'VisualMediaObject');

module.exports = Photo;
