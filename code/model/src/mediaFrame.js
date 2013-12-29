'use strict';

var Common = require('animates-common'),
	MediaObject = require('./mediaObject');

/**
 *  Creates a new MediaFrame.
 *  @class Represents the specific frame of a media object. 
 *  @param {object} options the constructor options.
 *  @param {MediaObject} options.mediaObject the frame mediaObject reference.
 *  @param {integer} options.currentTick the current tick number which is represented by the instance.
 */
function MediaFrame (options) {
	var _self = this,
		defaultOptions = {
			currentTick : -1,
			mediaObject : null
		},
		currentOptions,
		currentProperties;

	/**
	 * Sets or gets the properties
	 * @param  {object} [values] The new properties values to be set (it can be a subset of the propeties. Missing properties will remain as untouched)
	 * @return {object} The properties object with its current values
	 */
	this.properties = function properties (values) {
		if (values) {
			currentProperties = Common.extend(values, currentProperties);
		} else {
			return currentProperties;
		}
	};

	/**
	 *  Constructor
	 */
	(function init() {
		currentOptions = Common.extend(options || {}, defaultOptions),
		currentProperties = currentOptions.mediaObject.getProperties();
	}());
}

module.exports = MediaFrame;
