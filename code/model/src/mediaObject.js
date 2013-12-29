'use strict';

var Common = require('animates-common');

/**
 *  Creates a new MediaObject
 *  @class Represents a MediaObject. 
 */
function MediaObject (options) {
	var _self = this,
		guid = '',
		properties = options || {};

	/**
	 * Get the properties
	 * @return {Object} The current properties
	 */
	this.getProperties = function getProperties()
	{
		return Common.clone(properties);
	};

	/**
	 * Get the properties
	 * @return {Object} The current properties
	 */
	this.getProperty = function getProperties(name)
	{
		if (name){
			return properties[name];
		}

		return undefined;
	};

	/**
	 * Set the property named after the first parameter value 
	 * @return {Object} The current properties
	 */
	this.setProperty = function setProperty(name, value)
	{
		if (name){
			properties[name] = value;
		}
	};

	/**
	 * Gets the guid of the MediaObject
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		guid = Common.createGuid();
	}());
}

module.exports = MediaObject;