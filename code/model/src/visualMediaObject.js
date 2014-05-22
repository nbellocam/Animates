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
		defaultProperties = {
			position : {
				x : 0,
				y : 0,
				z : 0
			},
			opacity: 1,
			border : {
				type : 'none',
				color : 'black'
			},
			fill : 'black',
			angle : 0,
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.MediaObject(properties); // Call base constructor

	this.mediaObject_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.mediaObject_fromJSON(json);
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(VisualMediaObject, MediaObject, 'MediaObject');

module.exports = VisualMediaObject;
