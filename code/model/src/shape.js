'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Common = require('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape. 
 */
function Shape (options) {
	var _self = this,
		properties = options || {};
	
	this.VisualMediaObject(properties); // Call base constructor

	this.mediaObject_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.mediaObject_toJSON();
	};

	this.visualMediaObject_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.visualMediaObject_fromJSON(json);
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Shape, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Shape);

module.exports = Shape;
