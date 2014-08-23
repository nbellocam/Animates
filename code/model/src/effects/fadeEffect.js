'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	straightPathStrategy = require('./pathStrategies/straightPathStrategy'),
	Effect = require('../finiteEffect.js');


/**
 *  Creates a new FadeEffect.
 *  @class Represents an FadeEffect .
 */
function FadeEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'startOpacity' : 0,
			'endOpacity' : 1
		};

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder
					.property('startOpacity', PropertyBuilder)
						.value(options.startOpacity)
						.type('float')
					.add()
					.property('endOpacity', PropertyBuilder)
						.value(options.endOpacity)
						.type('float')
					.add();

		_self.base(options, propBuilder);
	}());

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			startOpacity = _self.getOption('startOpacity'),
			endOpacity = _self.getOption('endOpacity'),
			currentOpacity;

		if (startTick > tick) {
			return mediaFrameProperties;
		}

		if (endTick <= tick) {
			currentOpacity = endOpacity;
		} else {
			var ticksAmount = endTick - startTick,
				currentPathPercentage = (tick - startTick) / ticksAmount,
				delta = (endOpacity - startOpacity) * currentPathPercentage;

			currentOpacity = startOpacity + delta;
		}

		mediaFrameProperties.opacity = currentOpacity;

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return ['opacity'];
	};

	this.updateProperties = function (tick, updatedProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			opacity = updatedProperties.opacity,
			changedProperties = [];

		if (opacity === undefined) {
			return { updatedProperties: changedProperties };
		}

		if (tick === startTick) {
			_self.setOption('startOpacity', opacity);
			changedProperties.push('opacity');
		}

		if (tick === endTick) {
			_self.setOption('endOpacity', opacity);
			changedProperties.push('opacity');
		}

		return { updatedProperties: changedProperties };
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(FadeEffect, Effect);

JsonSerializer.registerType(FadeEffect);

module.exports = FadeEffect;
