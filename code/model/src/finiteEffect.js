'use strict';

var Common = require('animates-common'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Effect = require('./effect');

/**
 *  Creates a new FiniteEffect.
 *  @class Represents an FiniteEffect .
 */
function FiniteEffect (options, builder) {

	options = options || {};

	var _self = this,
		propBuilder,
		defaultOptions = {
			startTick : 0,
			endTick : 100
		},
		currentOptions = {};

	/**
	 *  Constructor
	 */
	(function preInit() {
		currentOptions = Common.extend(options, defaultOptions);
		if (currentOptions.endTick !== -1 && currentOptions.endTick <= currentOptions.startTick) {
			currentOptions.endTick = currentOptions.startTick + defaultOptions.endTick;
		}

		propBuilder = builder || new CompositePropertyBuilder();
		propBuilder.property('endTick', PropertyBuilder)
						.value(currentOptions.endTick)
						.type('float')
						.constraint(function (val) { return (val >= 0) && (!_self.getOption || (val > _self.getOption('startTick'))); })
					.add()
					.property('startTick', PropertyBuilder)
						.value(currentOptions.startTick)
						.type('float')
						.constraint(function (val) { return (val >= 0) && (!_self.getOption || (val < _self.getOption('endTick'))); })
					.add();

		_self.Effect(currentOptions, propBuilder);
	}());

	this.isInfinite = function() {
		return false;
	};

	var baseSetOptions = this.setOptions;
	this.setOptions = function (options) {
		var newOptions = {};

		if (options.startTick && options.endTick) {
			for(var name in options) {
				if (name !== 'startTick' && name !== 'endTick') {
					_self.setOption(name, options[name]);
				} else {
					newOptions[name] = options[name];
				}
			}

			if (newOptions.startTick > _self.getOption('endTick')) {
				_self.setOption('endTick', newOptions.endTick);
				_self.setOption('startTick', newOptions.startTick);
			} else {
				_self.setOption('startTick', newOptions.startTick);
				_self.setOption('endTick', newOptions.endTick);
			}
		} else {
			baseSetOptions(options);
		}
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(FiniteEffect, Effect, 'Effect');

JsonSerializer.registerType(FiniteEffect);

module.exports = FiniteEffect;
