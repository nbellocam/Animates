/*global describe, it */

'use strict';

var FadeEffect = require('../../../src/effects/fadeEffect'),
	should = require("should");

describe('FadeEffect', function() {
	describe('constructor', function() {
		it('Should generate a random guid', function() {
			var effect1 = new FadeEffect(),
				effect2 = new FadeEffect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});

	describe('getType', function() {
		it('Should retrieve FadeEffect as type.', function() {
			var instance = new FadeEffect();

			instance.getType().should.be.equal('FadeEffect');
		});
	});


	describe('getAffectedProperties', function() {
		it('Should return "opacity"', function() {
			var effect = new FadeEffect();
			var effectAffectedProperties = effect.getAffectedProperties();

			should(effectAffectedProperties)
				.be.instanceof(Array)
				.and.have.lengthOf(1);
			should(effectAffectedProperties)
				.containEql('opacity');
		});
	});

	describe('startTick', function() {
		it('Should start at 0 if it not specified otherwise', function() {
			var effect = new FadeEffect();

			effect.getOption('startTick').should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function() {
			var startTick = 42,
				effect = new FadeEffect({ 'startTick' : startTick });

			effect.getOption('startTick').should.be.exactly(startTick);
		});
	});

	describe('endTick', function() {
		it('Should end at 100 if it not specified otherwise', function() {
			var effect = new FadeEffect();

			effect.getOption('endTick').should.be.exactly(100);
		});

		it('Should end at the value specified using the constructor', function() {
			var endTick = 42,
				effect = new FadeEffect({ 'endTick' : endTick });

			effect.getOption('endTick').should.be.exactly(endTick);
		});
	});

	describe('getProperties()', function() {
		it('Should retrive the original mediaFrame with no changes if the tick is before the startTick.', function() {
			var tick = 0,
				result = 0.1,
				mediaFrameProperties = { 'opacity' : result },
				effect = new FadeEffect({
					'startTick' : 10,
					'endTick': 20,
					'startOpacity': 0.3,
					'endOpacity': 0.8
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('opacity');
			resultMediaFrameProperties.opacity.should.be.approximately(result, 0.001);
		});

		it('Should retrive the original mediaFrame with the end opacitiy if the tick is before the endTick.', function() {
			var tick = 100,
				result = 0.8,
				mediaFrameProperties = { 'opacity' : result },
				effect = new FadeEffect({
					'startTick' : 10,
					'endTick': 20,
					'startOpacity': 0.3,
					'endOpacity': result
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('opacity');
			resultMediaFrameProperties.opacity.should.be.approximately(result, 0.001);
		});

		it('Should retrive the original mediaFrame with the new position if the tick is between the startTick and the endTick.', function() {
			var tick = 15,
				result = 0.6,
				mediaFrameProperties = { 'opacity' : result },
				effect = new FadeEffect({
					'startTick' : 10,
					'endTick': 20,
					'startOpacity': 0.3,
					'endOpacity': 0.9
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('opacity');
			resultMediaFrameProperties.opacity.should.be.approximately(result, 0.001);
		});

		it('Should retrive the original mediaFrame with the new position if the tick is between the startTick and the endTick (going from 0 to 1 not in the middle).', function() {
			var tick = 7,
				result = 0.7,
				mediaFrameProperties = { 'opacity' : result },
				effect = new FadeEffect({
					'startTick' : 0,
					'endTick': 10,
					'startOpacity': 0,
					'endOpacity': 1
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('opacity');
			resultMediaFrameProperties.opacity.should.be.approximately(result, 0.001);
		});

		it('Should retrive the original mediaFrame with the new position if the tick is between the startTick and the endTick (going from 1 to 0).', function() {
			var tick = 7,
				result = 0.3,
				mediaFrameProperties = { 'opacity' : result },
				effect = new FadeEffect({
					'startTick' : 0,
					'endTick': 10,
					'startOpacity': 1,
					'endOpacity': 0
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('opacity');
			resultMediaFrameProperties.opacity.should.be.approximately(result, 0.001);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var effect = new FadeEffect(),
				json = effect.toJSON();

			json.should.have.keys('options', 'guid');
			json.options.should.have.keys('startTick', 'endTick', 'startOpacity', 'endOpacity');
		});

		it('fromJSON should load the object', function() {
			var effect = new FadeEffect({ 'startTick' : 100, 'endTick' : 200, 'startOpacity': 0, 'endOpacity': 1 }),
				json = effect.toJSON(),
				effect2 = new FadeEffect();

			effect2.fromJSON(json);
			effect2.getGuid().should.equal(effect.getGuid());
			effect2.getOptions().should.have.property('startTick', 100);
			effect2.getOptions().should.have.property('endTick', 200);
			effect2.getOptions().should.have.property('startOpacity', 0);
			effect2.getOptions().should.have.property('endOpacity', 1);
		});
	});

	describe('updateProperties', function() {
		it('Should return empty array and not modify the opacity if an empty list properties was passed by param', function() {
			var tick = 5,
				endTick = tick,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				updatedPropertiesDiff = { },
				effect = new FadeEffect({
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(oldValueStart, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(oldValueEnd, 0.001);
		});

		it('Should return empty array and not modify the opacity if a not applying list of properties was passed by param', function() {
			var tick = 5,
				endTick = tick,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				updatedPropertiesDiff = { 'something' : 'notUsed' },
				effect = new FadeEffect({
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(oldValueStart, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(oldValueEnd, 0.001);
		});

		it('Should return empty array and not modify the opacity if the tick is not contained in the effect', function() {
			var tick = 50,
				endTick = 10,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				updatedPropertiesDiff = { 'opacity' : 0.4 },
				effect = new FadeEffect({
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(oldValueStart, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(oldValueEnd, 0.001);
		});

		it('Should return empty array and not modify any position if the tick is between startTick and endTick in the effect', function() {
			var tick = 5,
				endTick = 10,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				updatedPropertiesDiff = { 'opacity' : 0.4 },
				effect = new FadeEffect({
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(oldValueStart, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(oldValueEnd, 0.001);
		});

		it('Should return "startOpacity" in the array and modify start value if opacity is passed by param in startTick', function() {
			var tick = 5,
				endTick = 10,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				newValue = 0.4,
				updatedPropertiesDiff = { 'opacity' : newValue },
				effect = new FadeEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('opacity');

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(newValue, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(oldValueEnd, 0.001);
		});

		it('Should return "endOpacity" in the array and modify start value if opacity is passed by param in endTick', function() {
			var tick = 5,
				endTick = tick,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				newValue = 0.4,
				updatedPropertiesDiff = { 'opacity' : newValue },
				effect = new FadeEffect({
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('opacity');

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(oldValueStart, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(newValue, 0.001);
		});

		it('Should return "endOpacity" in the array and modify start value if opacity is passed by param in endTick along with more properties.', function() {
			var tick = 5,
				endTick = tick,
				oldValueStart = 0.3,
				oldValueEnd = 0.9,
				newValue = 0.4,
				updatedPropertiesDiff = {
					'opacity' : newValue,
					'other' : { 'newValue' : newValue, 'oldValue' : newValue },
					'oldValue' : newValue
				},
				effect = new FadeEffect({
					'endTick' : endTick,
					'startOpacity': oldValueStart,
					'endOpacity': oldValueEnd
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('opacity');

			newOptions.should.have.property('startOpacity');
			newOptions.startOpacity.should.be.approximately(oldValueStart, 0.001);

			newOptions.should.have.property('endOpacity');
			newOptions.endOpacity.should.be.approximately(newValue, 0.001);
		});
	});
});
