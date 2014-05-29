'use strict';

var Common = require('animates-common'),
	PropertiesArrayBuilder = require('./properties/propertiesArrayBuilder'),
	JsonSerializer = require('./serialization/jsonSerializer');


/**
 *  Creates a new MediaObject
 *  @class Represents a MediaObject. 
 */
function MediaObject (options, builder) {
	var _self = this,
		guid = '',
		propBuilder,
		properties;

	/**
	 * Get the properties
	 * @return {Object} The current properties
	 */
	this.getProperties = function getProperties() {
		return properties.valuesToJSON();
		// TODO esto no va mas
	};

	/**
	 * Set the properties
	 * @params {array} properties An array with properties: values pairs to be updated
	 */
	this.setProperties = function setProperties(prop) {
		for (var propertyName in prop) {
			properties.setValue(propertyName, prop[propertyName]);
		}
	};

	/**
	 * Get the property named after the first parameter value 
	 * @return {Object} The property value
	 */
	this.getProperty = function getProperty(name) {
		return properties.getValue(name);
	};

	/**
	 * Set the property named after the first parameter value 
	 * @params {string} name The property name
	 * @params {Object} value The property value
	 */
	this.setProperty = function setProperty(name, value) {
		properties.setValue(name, value);
	};

	/**
	 * Gets the guid of the MediaObject
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	this.getType = function getType(){
		return Common.realTypeOf(this);
	};

	this.toJSON = function () {
		var ser =	{
						'properties' : properties.valuesToJSON(),
						'guid' : _self.getGuid()
					};

		return ser;
	};

	this.fromJSON = function (json) {
		properties.valuesFromJSON(json.properties);
		guid = json.guid;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		guid = Common.createGuid();
		propBuilder = builder || new PropertiesArrayBuilder();
		properties = propBuilder.create();
	}());
}

JsonSerializer.registerType(MediaObject);

module.exports = MediaObject;