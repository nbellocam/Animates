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
			var parts = name.split('.'),
			parent = properties,
			currentPart = '',
			length = parts.length;

			for(var i = 0; i < length && parent; i++) {
				currentPart = parts[i];
				parent = parent[currentPart] || undefined;
			}

			return parent;
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
			var parts = name.split('.'),
			parent = properties,
			oldParent,
			currentPart = '',
			length = parts.length;

			for(var i = 0; i < length; i++) {
				currentPart = parts[i];
				oldParent = parent;
				oldParent[currentPart] = parent[currentPart] || {};
				parent = oldParent[currentPart];
			}

			oldParent[currentPart] = value;
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