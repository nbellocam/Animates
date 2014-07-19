/*global describe, it */

'use strict';

var MoveEffect = require('../../../src/effects/moveEffect'),
	should = require("should");

describe('MoveEffect', function() {
	describe('constructor', function() {
		it('Should generate a random guid', function() {
			var effect1 = new MoveEffect(),
				effect2 = new MoveEffect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});

	describe('getType', function() {
		it('Should retrieve MoveEffect as type.', function() {
			var instance = new MoveEffect();

			instance.getType().should.be.equal('MoveEffect');
		});
	});


	describe('getAffectedProperties', function() {
		it('Should return "position"', function() {
			var effect = new MoveEffect();
			var effectAffectedProperties = effect.getAffectedProperties();

			should(effectAffectedProperties)
				.be.instanceof(Array)
				.and.have.lengthOf(1);
			should(effectAffectedProperties)
				.containEql('position');
		});
	});

	describe('startTick', function() {
		it('Should start at 0 if it not specified otherwise', function() {
			var effect = new MoveEffect();

			effect.getOption('startTick').should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function() {
			var startTick = 42,
				effect = new MoveEffect({ 'startTick' : startTick });

			effect.getOption('startTick').should.be.exactly(startTick);
		});
	});

	describe('endTick', function() {
		it('Should end at -1 if it not specified otherwise', function() {
			var effect = new MoveEffect();

			effect.getOption('endTick').should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function() {
			var endTick = 42,
				effect = new MoveEffect({ 'endTick' : endTick });

			effect.getOption('endTick').should.be.exactly(endTick);
		});
	});

	describe('getProperties()', function() {
		it('Should throw exception if path is not valid.', function() {
			var tick = 10,
				mediaFrameProperties = { 'position' : { 'x' : 50, 'y' : 100 } };

			(function(){
				new MoveEffect({ 'path' : 'invalidPathStrategy' });
			}).should.throw('The property \'path\' could not be built due to invalid value.');
		});

		it('Should retrive the original mediaFrame with no changes if the tick is before the startTick.', function() {
			var tick = 0,
				resultX = 50,
				resultY = 100,
				mediaFrameProperties = { 'position' : { 'x' : resultX, 'y' : resultY } },
				effect = new MoveEffect({
					'path' : 'Straight',
					'startTick' : 10,
					'endTick': 20,
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', resultX);
			resultMediaFrameProperties.position.should.have.property('y', resultY);
		});

		it('Should retrive the original mediaFrame with the last position if the tick is before the endTick.', function() {
			var tick = 100,
				resultX = 10,
				resultY = 20,
				mediaFrameProperties = { 'position' : { 'x' : 50, 'y' : 100 } },
				effect = new MoveEffect({
					'path' : 'Straight',
					'startTick' : 10,
					'endTick': 20,
					'endPosition': {  'x' : resultX, 'y' : resultY }
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', resultX);
			resultMediaFrameProperties.position.should.have.property('y', resultY);
		});

		it('Should retrive the original mediaFrame with the new position if the tick is between the startTick and the endTick.', function() {
			var tick = 15,
				resultX = 5,
				resultY = 10,
				mediaFrameProperties = { 'position' : { 'x' : 50, 'y' : 100 } },
				effect = new MoveEffect({
					'path' : 'Straight',
					'startTick' : 10,
					'endTick': 20,
					'endPosition': {  'x' : 10, 'y' : 20 }
					}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x');
			resultMediaFrameProperties.position.x.should.be.approximately(resultX, 0.1);

			resultMediaFrameProperties.position.should.have.property('y');
			resultMediaFrameProperties.position.y.should.be.approximately(resultY, 0.1);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var effect = new MoveEffect(),
				json = effect.toJSON();

			json.should.have.keys('options', 'guid');
			json.options.should.have.keys('startTick', 'endTick', 'path', 'startPosition', 'endPosition');
		});

		it('fromJSON should load the object', function() {
			var effect = new MoveEffect({ 'startTick' : 100, 'endTick' : 200 }),
				json = effect.toJSON(),
				effect2 = new MoveEffect();

			effect2.fromJSON(json);
			effect2.getGuid().should.equal(effect.getGuid());
			effect2.getOptions().should.have.property('startTick', 100);
			effect2.getOptions().should.have.property('endTick', 200);
		});
	});

	describe('updateProperties', function() {
		it('Should return empty array and not modify any position if an empty list properties was passed by param', function() {
			var tick = 5,
				endTick = tick,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = { },
				effect = new MoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return empty array and not modify any position if a not applying list of properties was passed by param', function() {
			var tick = 5,
				endTick = tick,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = { 'something' : 'notUsed' },
				effect = new MoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return empty array and not modify any position if the tick is not contained in the effect', function() {
			var tick = 50,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return empty array and not modify any position if the tick is between startTick and endTick in the effect', function() {
			var tick = 5,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(0);

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return position.x in the array and modify start value if only position.x is passed by param in startTick', function() {
			var tick = 5,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('position.x');

			newOptions.startPosition.should.have.property('x', newValue);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return position.y in the array and modify start value if only position.y is passed by param in startTick', function() {
			var tick = 5,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.y' : newValue },
				effect = new MoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('position.y');

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', newValue);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return both position in the array and modify start values if both positions are passed by param in startTick', function() {
			var tick = 5,
				endTick = 10,
				newValueX = 25,
				newValueY = 30,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = {
					'position.x' : newValueX,
					'position.y' : newValueY
				},
				effect = new MoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(2);
			updatedProperties.should.containEql('position.x');
			updatedProperties.should.containEql('position.y');

			newOptions.startPosition.should.have.property('x', newValueX);
			newOptions.startPosition.should.have.property('y', newValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return both position in the array and modify start values if both positions are passed by param in startTick with more properties', function() {
			var tick = 5,
				endTick = 10,
				newValueX = 25,
				newValueY = 30,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = {
					'position.x' : newValueX,
					'position.y' : newValueY,
					'other' : { 'newValue' : newValueY, 'oldValue' : oldValueY }
				},
				effect = new MoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(2);
			updatedProperties.should.containEql('position.x');
			updatedProperties.should.containEql('position.y');

			newOptions.startPosition.should.have.property('x', newValueX);
			newOptions.startPosition.should.have.property('y', newValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return position.x in the array and modify start value if only position.x is passed by param in endTick', function() {
			var tick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('position.x');

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', newValue);
			newOptions.endPosition.should.have.property('y', oldValueY);
		});

		it('Should return position.y in the array and modify start value if only position.y is passed by param in endTick', function() {
			var tick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.y' : newValue },
				effect = new MoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(1);
			updatedProperties.should.containEql('position.y');

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', oldValueX);
			newOptions.endPosition.should.have.property('y', newValue);
		});

		it('Should return both position in the array and modify start values if both positions are passed by param in endTick', function() {
			var tick = 10,
				newValueX = 25,
				newValueY = 30,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = {
					'position.x' : newValueX,
					'position.y' : newValueY
				},
				effect = new MoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(2);
			updatedProperties.should.containEql('position.x');
			updatedProperties.should.containEql('position.y');

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', newValueX);
			newOptions.endPosition.should.have.property('y', newValueY);
		});

		it('Should return both position in the array and modify start values if both positions are passed by param in endTick with more properties', function() {
			var tick = 10,
				newValueX = 25,
				newValueY = 30,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = {
					'position.x' : newValueX,
					'position.y' : newValueY,
					'other' : { 'newValue' : newValueY, 'oldValue' : oldValueY }
				},
				effect = new MoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'startPosition' : { 'x': oldValueX, 'y': oldValueY },
					'endPosition' : { 'x': oldValueX, 'y': oldValueY }
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options,
				updatedProperties = result.updatedProperties;

			updatedProperties.should.have.length(2);
			updatedProperties.should.containEql('position.x');
			updatedProperties.should.containEql('position.y');

			newOptions.startPosition.should.have.property('x', oldValueX);
			newOptions.startPosition.should.have.property('y', oldValueY);
			newOptions.endPosition.should.have.property('x', newValueX);
			newOptions.endPosition.should.have.property('y', newValueY);
		});
	});
});
