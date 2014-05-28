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
	 * Get the property named after the first parameter value 
	 * @return {Object} The property value
	 */
	this.getProperty = function getProperty(name)
	{
		if (name){
			var parts = name.split('.'),
			parent = currentProperties,
			currentPart = '',
			length = parts.length;

			for(var i = 0; i < length && parent; i++) {
				currentPart = parts[i];
				parent = parent[currentPart];
			}

			return parent;
		}

		return undefined;
	};

	/**
	 * Gets the guid of the original MediaObject
	 * @return {string} the guid
	 */
	this.getMediaObjectGuid = function getMediaObjectGuid (values) {
		return currentOptions.mediaObject.getGuid();
	};

	/**
	 * Gets the type of the original MediaObject
	 * @return {string} the type
	 */
	this.getMediaObjectType = function getMediaObjectType (values) {
		return currentOptions.mediaObject.getType();
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
