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
function MultiPointScaleEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'points' : {}
		},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder;

		propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('radius', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add()
			.property('height', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add()
			.property('width', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add();

		_self.MultiPointEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

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
			if (!segment.endPoint) {
				return segment.startPoint[scaleType];
			} else {
				return getScaleFor(tick, segment.startPoint, segment.endPoint, scaleType);
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
			segment = segmentHelper.getSegment(tick, points);

		updateMediaFrameProperties(tick, segment, 'width', mediaFrameProperties);
		updateMediaFrameProperties(tick, segment, 'height', mediaFrameProperties);
		updateMediaFrameProperties(tick, segment, 'radius', mediaFrameProperties);

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return ['width', 'height', 'radius'];
	};

	function addPoint(guid, tick, width, height, radius) {
		var points = _self.getPointsArray(),
			segment = segmentHelper.getSegment(tick, points),
			data;

		if (radius === undefined ) {
			data = {
				'width': (width === undefined) ? getScaleForSegment(tick, segment, 'width') : width,
				'height': (height === undefined) ? getScaleForSegment(tick, segment, 'height') : height
			};

			_self.addPoint(guid, tick, data);

			return ['width', 'height'];
		} else {
			data = {
				'radius': radius
			};

			_self.addPoint(guid, tick, data);
			return ['radius'];
		}
	}

	function updatePoint(scaleType, scaleValue, guid, changedProperties) {
		if (scaleValue !== undefined) {
			_self.setOption('points.' + guid + '.' + scaleType, scaleValue);
			changedProperties.push(scaleType);
		}
	}

	this.updateProperties = function (tick, updatedProperties) {
		var width = updatedProperties.width,
			height = updatedProperties.height,
			radius = updatedProperties.radius,
			changedProperties = [],
			points;

		if (width === undefined && height === undefined && radius === undefined) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointScaleEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			return	{
						'updatedProperties' : addPoint(newPoint.guid, tick, width, height, radius)
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				updatePoint('width', width, guid, changedProperties);
				updatePoint('height', height, guid, changedProperties);
				updatePoint('radius', radius, guid, changedProperties);

				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
			return	{
						'updatedProperties' : addPoint(newPointGuid, tick, width, height, radius),
						'newProperties' : {
							'MultiPointScaleEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid() }
						}
					};
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
