/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var MediaObject = require('./mediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new VisualMediaObject
 *  @class Represents a Shape. 
 */
function VisualMediaObject (options) {
	var _self = this,
		defaultOptions = {
			position : {
				x : 0,
				y : 0,
				z : 0
			},
			opacity: 1,
			border : {
				type : 'none',
				color : 'black'
			}
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

Common.inherits(VisualMediaObject, MediaObject, 'MediaObject');

module.exports = VisualMediaObject;
