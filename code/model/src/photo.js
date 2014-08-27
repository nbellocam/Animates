/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Photo
 *  @class Represents a Photo.
 */
function Photo (options, builder) {
	var _self = this,propBuilder,
		properties,
		defaultOptions = {
			height : 100,
			width : 100,
			source : '',
			name: 'Photo'
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
					.add()
					.property('source', PropertyBuilder)
						.value(options.source)
						.type('imageFile')
					.add();

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['height', 'width'];
	};

	this.base_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.base_toJSON();
	};

	this.base_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.base_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Photo, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Photo);

module.exports = Photo;
