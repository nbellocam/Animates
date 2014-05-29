/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	PropertiesArrayBuilder = require('./properties/propertiesArrayBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Photo
 *  @class Represents a Photo. 
 */
function Photo (options, builder) {
	var _self = this,propBuilder,
		properties,
		defaultOptions = {
			source : ''
		};	

	this.base_toJSON = this.toJSON;
	this.toJSON = function () {
		var ser = _self.base_toJSON();
		return ser;
	};
	/**
	 *  Constructor
	 */ 
	(function init() {
		propBuilder = builder || new PropertiesArrayBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('source')
						.value(options.source)
						.type('string')
					.add();
		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Photo, VisualMediaObject, 'VisualMediaObject');

module.exports = Photo;
