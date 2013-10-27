/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Common = require('animates-common');

/**
 *  Creates a new MediaObject
 *  @class Represents a MediaObject. 
 */
function MediaObject (options) {
	options = options || {};

	var _self = this,
		guid = '';

	/**
	 * Gets the guid of the MediaObject
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		guid = Common.createGuid();
	}());
}

module.exports = MediaObject;