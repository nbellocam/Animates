'use strict';

var MediaObject = require('./mediaObject'),
	PropertiesArrayBuilder = require('./properties/propertiesArrayBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Sound
 *  @class Represents a Sound. 
 */
function Sound (options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			volume : 100,
			source : ''
		},
		properties;

	/**
	 *  Constructor
	 */ 
	(function init() {
		propBuilder = builder || new PropertiesArrayBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('volume')
						.value(options.volume)
						.type('integer')
					.add()
					.property('source')
						.value(options.source)
						.type('string')
					.add();

		_self.MediaObject(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Sound, MediaObject, 'MediaObject');

module.exports = Sound;