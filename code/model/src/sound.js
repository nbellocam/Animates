'use strict';

var MediaObject = require('./mediaObject'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
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
			source : '',
			name : 'Sound'
		},
		properties;

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('volume', PropertyBuilder)
						.value(options.volume)
						.type('integer')
					.add()
					.property('source', PropertyBuilder)
						.value(options.source)
						.type('string')
					.add();

		_self.MediaObject(options, propBuilder); // Call base constructor
	}());

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Sound, MediaObject, 'MediaObject');

module.exports = Sound;
