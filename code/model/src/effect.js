'use strict';

var Common = require('animates-common'),
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
			endTick : -1
		},
		currentOptions = {};

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
		var currentAffectedProperties = this.getAffectedProperties();

		return currentAffectedProperties.filter(function(n) {
			return effectAffectedProperties.indexOf(n) != -1;
		});
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getCommonAffectedProperties = function (effect) {
		return this.getCommonAffectedPropertiesFromList(effect.getAffectedProperties());
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
		var currentAffectedProperties = this.getAffectedProperties();

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
			return this.getCommonAffectedPropertiesFromList(effectAffectedProperties).length > 0;
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

	this.getOption = function (name) {
		return currentOptions.getValue(name);
	};

	this.setOption = function (name, value) {
		currentOptions.setValue(name, value);
	};

	this.getOptions = function () {
		return currentOptions.valuesToJSON();
		// TODO esto no va mas;
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

	/**
	 *  Constructor
	 */
	(function init() {
		currentOptions = Common.extend(options || {}, defaultOptions),
		guid = Common.createGuid();
		propBuilder = builder || new CompositePropertyBuilder();
		propBuilder.property('startTick')
						.value(currentOptions.startTick)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('endTick')
						.value(currentOptions.endTick)
						.type('float')
						.constraint(function (val) { return (val >= -1); })
					.add();
		currentOptions = propBuilder.create();
	}());
}

JsonSerializer.registerType(Effect);

module.exports = Effect;
