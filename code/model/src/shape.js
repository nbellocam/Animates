'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape.
 */
function Shape (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			name: 'Shape'
		};

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
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Shape, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Shape);

module.exports = Shape;
