'use strict';

var Common = require('animates-common'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	JsonSerializer = require('./serialization/jsonSerializer');

/**
 *  Creates a new Effect.
 *  @class Represents an Effect .
 */
function Effect (options, builder) {

	options = options || {};

	var _self = this,
		guid = '',
		propBuilder,
		defaultOptions = {
			startTick : 0,
			endTick : 100
		},
		currentOptions = {};

	/**
	 *  Constructor
	 */
	(function init() {
		currentOptions = Common.extend(options, defaultOptions);
		if (currentOptions.endTick !== -1 && currentOptions.endTick <= currentOptions.startTick) {
			currentOptions.endTick = currentOptions.startTick + defaultOptions.endTick;
		}

		guid = Common.createGuid();
		propBuilder = builder || new CompositePropertyBuilder();
		propBuilder.property('startTick', PropertyBuilder)
						.value(currentOptions.startTick)
						.type('float')
						.constraint(function (val) { return (val >= 0) && (!_self.getOption || (val > _self.getOption('endTick'))); })
					.add()
					.property('endTick', PropertyBuilder)
						.value(currentOptions.endTick)
						.type('float')
						.constraint(function (val) { return (val === -1) || !_self.getOption || (val > _self.getOption('startTick')); })
					.add();
		currentOptions = propBuilder.create();
	}());

	/**
	 * Calculates the new shape properties based on the original ones and the current tick.
	 * @param {integer} tick The current tick number.
	 * @param {object} originalProperties The original properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		return mediaFrameProperties;
	};

	/**
	 * Gets the guid of the effect
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getAffectedProperties = function () {
		return [];
	};

	/**
	* Updates the effect if it is required based on the updatedPropertiesDiff passed by parameter
	* @param {integer} tick the tick that is being updated
	* @param {Array} updatedPropertiesDiff the list of updated properties with the newValue as data for each property.
	* @return The array of properties names that the effect update
	*/
	this.updateProperties = function (tick, updatedPropertiesDiff) {
		return [];
	};

	/**
	* Gets the array of properties names that the effect modifies
	* @return The array of properties names
	*/
	this.getCommonAffectedPropertiesFromList = function (effectAffectedProperties) {
		var currentAffectedProperties = _self.getAffectedProperties();

		return currentAffectedProperties.filter(function(n) {
			return effectAffectedProperties.indexOf(n) != -1;
		});
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getCommonAffectedProperties = function (effect) {
		return _self.getCommonAffectedPropertiesFromList(effect.getAffectedProperties());
	};

	/**
	* Detects if the current effect change some of the properties of the requested
	* effects also changes
	* If the strict parameter is passed as true then all the properties must match
	*
	* @param {Array} effectAffectedProperties The list of effect properties on which conflicts must be checked
	* @param {boolean} strict means that all properties must match to indicate a conflict
	* @return true if a match was found (according to the strict paramter)
	*/
	this.HasConflictWithListOfProperties = function (effectAffectedProperties, strict) {
		// Check for all properties to indicate a conflict
		var currentAffectedProperties = _self.getAffectedProperties();

		if (strict) {
			if (currentAffectedProperties.length == effectAffectedProperties.length) {
				for (var i = 0; i < currentAffectedProperties.length; i++) {
					if ((effectAffectedProperties.indexOf(currentAffectedProperties[i])) == -1)
					{
						return false;
					}
				}

				return true;
			} else {
				return false;
			}
		} else {
			return _self.getCommonAffectedPropertiesFromList(effectAffectedProperties).length > 0;
		}
	};

	/**
	 * Detects if the current effect change some of the properties of the requested
	 * effects also changes
	 * If the strict parameter is passed as true then all the properties must match
	 *
	 * @param {Effect} effect The effect on which conflicts must be checked
	 * @param {boolean} strict means that all properties must match to indicate a conflict
	 * @return true if a match was found (according to the strict paramter)
	 */
	this.HasConflictWithProperties = function (effect, strict) {
		return this.HasConflictWithListOfProperties(effect.getAffectedProperties(), strict);
	};

	this.isInfinite = function() {
		return false;
	};

	this.getOption = function (name) {
		var prop = currentOptions.get(name);
		if (prop.value) {
			return prop.value();
		}

		return prop.valuesToJSON();
	};

	this.setOption = function (name, value) {
		currentOptions.setValue(name, value);
	};

	/**
	* Get the options values
	* @return {Object} The current properties
	*/
	this.getOptions = function getOptions() {
		return currentOptions.valuesToJSON();
		// TODO esto no va mas
	};

	/**
	* Get the properties schema with types and values
	* @return {Object} The current properties
	*/
	this.getPropertiesSchema = function getPropertiesSchema () {
		return currentOptions.clone();
	};

	this.setOptions = function (options) {
		for(var name in options) {
			_self.setOption(name, options[name]);
		}
	};

	this.toJSON = function () {
		var ser =	{
						'options' : currentOptions.valuesToJSON(),
						'guid' : _self.getGuid()
					};

		return ser;
	};

	this.fromJSON = function (json) {
		guid = json.guid;
		currentOptions.valuesFromJSON(json.options);
	};

	this.getType = function () {
		return Common.realTypeOf(this);
	};
}

JsonSerializer.registerType(Effect);

module.exports = Effect;
