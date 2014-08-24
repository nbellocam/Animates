'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	MultiPointEffect = require('../multiPointEffect.js'),
	segmentHelper = require('./utils/segmentHelper');


/**
 *  Creates a new MultiPointScaleEffect.
 *  @class Represents an MultiPointScaleEffect .
 */
function MultiPointScaleEffect(options, builder, pointsSchemaBuilder) {
	var _self = this,
		defaultOptions = {},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var propBuilder = builder || new CompositePropertyBuilder(),
			pointsBuilder = pointsSchemaBuilder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		_self.MultiPointEffect(options, propBuilder, pointsBuilder);
	}());

	function getScalablePropertiesIfExists(scalableProperties) {
		if (scalableProperties) {
			return scalableProperties;
		}

		return (_self.getScalablePropertiesNames) ? _self.getScalablePropertiesNames() : undefined;
	}

	function applyToScalableProperties(callback, scalableProperties) {
		var properties = getScalablePropertiesIfExists(scalableProperties);

		if (properties) {
			for (var i = 0; i < properties.length; i++) {
				callback(properties[i]);
			}
		}
	}

	function getScaleFor(currentTick, startPoint, endPoint, scaleType) {
		var startTick = startPoint.tick,
			endTick = endPoint.tick,
			startScale = startPoint[scaleType],
			endScale = endPoint[scaleType];

		if (startTick > currentTick) {
			return undefined; // The position can't be determined
		}

		if (endTick <= currentTick) {
			return endScale;
		}

		var ticksAmount = endTick - startTick,
			currentPathPercentage = (currentTick - startTick) / ticksAmount,
			delta = (endScale - startScale) * currentPathPercentage;

		return startScale + Math.round(delta);
	}

	function getScaleForSegment(tick, segment, scaleType) {
		if (segment && segment.startPoint) {
			if (segment.endPoint) {
				return getScaleFor(tick, segment.startPoint, segment.endPoint, scaleType);
			} else {
				return segment.startPoint[scaleType];
			}
		} else if (segment && segment.endPoint) {
			return segment.endPoint[scaleType];
		}
	}

	function updateMediaFrameProperties (tick, segment, scaleType, mediaFrameProperties) {
		if (mediaFrameProperties[scaleType]) {
			var scale = getScaleForSegment(tick, segment, scaleType);
			if (scale !== undefined) {
				mediaFrameProperties[scaleType] = scale;
			}
		}
	}

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var points = _self.getPointsArray(),
			segment = segmentHelper.getSegment(tick, points),
			scalableProperties = getScalablePropertiesIfExists();

		applyToScalableProperties(function(property) {
			updateMediaFrameProperties(tick, segment, property, mediaFrameProperties);
		}, scalableProperties);

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return getScalablePropertiesIfExists() || [];
	};

	function addScalePoint(guid, tick, inputData) {
		var points = _self.getPointsArray(),
			segment = segmentHelper.getSegment(tick, points),
			scalableProperties = getScalablePropertiesIfExists(),
			data = {};

		applyToScalableProperties(function(property) {
			data[property] = (inputData[property] === undefined) ? getScaleForSegment(tick, segment, property) : inputData[property];
		}, scalableProperties);

		_self.addPoint(guid, tick, data);
		return scalableProperties;
	}

	function updatePoint(scaleType, scaleValue, guid, changedProperties) {
		if (scaleValue !== undefined) {
			_self.setOption('points.' + guid + '.' + scaleType, scaleValue);
			changedProperties.push(scaleType);
		}
	}

	function updatePoints(data, guid, changedProperties, scalableProperties) {
		applyToScalableProperties(function(property) {
			updatePoint(property, data[property], guid, changedProperties);
		}, scalableProperties);
	}

	this.updateProperties = function (tick, updatedProperties) {
		var scalableProperties = getScalablePropertiesIfExists(),
			changedProperties = [],
			data = {},
			points,
			notFound = true;

		applyToScalableProperties(function(property) {
			if (updatedProperties[property] !== undefined) {
				notFound = false;
				data[property] = updatedProperties[property];
			}
		}, scalableProperties);

		if (notFound) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointScaleEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			changedProperties = addScalePoint(newPoint.guid, tick, data);
			changedProperties.push('MultiPointScaleEffect.newPoint');
			return	{
						'updatedProperties' : changedProperties
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				updatePoints(data, guid, changedProperties, scalableProperties);
				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
			return	{
						'updatedProperties' : addScalePoint(newPointGuid, tick, data),
						'newProperties' : {
							'MultiPointScaleEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid() }
						}
					};
	};

	this.getScalablePropertiesNames = function () {
		return [];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointScaleEffect, MultiPointEffect, 'MultiPointEffect');

JsonSerializer.registerType(MultiPointScaleEffect);

module.exports = MultiPointScaleEffect;
