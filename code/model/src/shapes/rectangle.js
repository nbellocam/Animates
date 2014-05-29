/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = require('../shape'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertiesArrayBuilder = require('../properties/propertiesArrayBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Rectangle
 *  @class Represents a Rectangle. 
 */
function Rectangle (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			height : 100,
			width : 100
		};

	this.shape_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.shape_toJSON();
	};

	this.shape_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.shape_fromJSON(json);
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		propBuilder = builder || new PropertiesArrayBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('height')
						.value(options.height)
						.type('integer')
					.add()
					.property('width')
						.value(options.width)
						.type('integer')
					.add();

		_self.Shape(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

JsonSerializer.registerType(Rectangle);

module.exports = Rectangle;
