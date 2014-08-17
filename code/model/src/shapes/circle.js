/*global Animates */
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = require('../shape'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Circle
 *  @class Represents a Circle.
 */
function Circle (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			radius : 50,
			name: 'Circle'
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
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('radius', PropertyBuilder)
						.value(options.radius)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add();

		_self.Shape(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Circle, Shape, 'Shape');

JsonSerializer.registerType(Circle);

module.exports = Circle;
