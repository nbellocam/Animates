/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = require('../shape'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
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
			width : 100,
			name: 'Rectangle'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('height', PropertyBuilder)
						.value(options.height)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('width', PropertyBuilder)
						.value(options.width)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add();

		_self.Shape(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['height', 'width'];
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
	(function postInit() {
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

JsonSerializer.registerType(Rectangle);

module.exports = Rectangle;
