/*global describe, it */

'use strict';

var MultiPointMoveEffect = require('../../../src/effects/multiPointMoveEffect'),
	should = require("should");

describe('MultiPointMoveEffect', function() {
	describe('constructor', function() {
		it('Should generate a random guid', function() {
			var effect1 = new MultiPointMoveEffect(),
				effect2 = new MultiPointMoveEffect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});

	describe('getType', function() {
		it('Should retrieve MultiPointMoveEffect as type.', function() {
			var instance = new MultiPointMoveEffect();

			instance.getType().should.be.equal('MultiPointMoveEffect');
		});
	});


	describe('getAffectedProperties', function() {
		it('Should return "position"', function() {
			var effect = new MultiPointMoveEffect();
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
			var effect = new MultiPointMoveEffect();

			effect.getOption('startTick').should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function() {
			var startTick = 42,
				effect = new MultiPointMoveEffect({ 'startTick' : startTick });

			effect.getOption('startTick').should.be.exactly(startTick);
		});
	});

	describe('endTick', function() {
		it('Should end at -1 if it not specified otherwise', function() {
			var effect = new MultiPointMoveEffect();

			effect.getOption('endTick').should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function() {
			var endTick = 42,
				effect = new MultiPointMoveEffect({ 'endTick' : endTick });

			effect.getOption('endTick').should.be.exactly(endTick);
		});
	});

	describe('getProperties()', function() {
		it('Should throw exception if path is not valid.', function() {
			var tick = 10,
				mediaFrameProperties = { 'position' : { 'x' : 50, 'y' : 100 } };

			(function(){
				new MultiPointMoveEffect({ 'path' : 'invalidPathStrategy' });
			}).should.throw('The property \'path\' could not be built due to invalid value.');
		});

		it('Should retrive the original mediaFrame with no changes if the tick is before the startTick.', function() {
			var tick = 0,
				resultX = 50,
				resultY = 100,
				mediaFrameProperties = { 'position' : { 'x' : resultX, 'y' : resultY } },
				effect = new MultiPointMoveEffect({
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
				effect = new MultiPointMoveEffect({
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : 0,
												'y' : 0
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : resultX,
												'y' : resultY
											}
										}	
								}
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
			var effect = new MultiPointMoveEffect(),
				json = effect.toJSON();

			json.should.have.keys('options', 'guid');
			json.options.should.have.keys('startTick', 'endTick', 'path', 'points');
		});

		it('fromJSON should load the object', function() {
			var effect = new MultiPointMoveEffect({ 'startTick' : 100, 'endTick' : 200 }),
				json = effect.toJSON(),
				effect2 = new MultiPointMoveEffect();

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
				effect = new MultiPointMoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(0);

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
		});

		it('Should return empty array and not modify any position if a not applying list of properties was passed by param', function() {
			var tick = 5,
				endTick = tick,
				oldValueX = 50,
				oldValueY = 100,
				updatedPropertiesDiff = { 'something' : 'notUsed' },
				effect = new MultiPointMoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(0);

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
		});

		it('Should return x and y and add a new point if the tick is between startTick and endTick in the effect', function() {
			var tick = 5,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MultiPointMoveEffect({
					'endTick' : endTick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : endTick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);

			Object.keys(newOptions.points).should.have.lengthOf(3);
			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
		});

		it('Should return position.x in the array and modify first point value if only position.x is passed by param in first point tick', function() {
			var tick = 5,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MultiPointMoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : endTick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('position.x');

			newOptions.points.id1.position.should.have.property('x', newValue);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
		});

		it('Should return position.y in the array and modify start value if only position.y is passed by param in startTick', function() {
			var tick = 5,
				endTick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.y' : newValue },
				effect = new MultiPointMoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : endTick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}

				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('position.y');

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', newValue);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
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
				effect = new MultiPointMoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : endTick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('position.x');
			result.updatedProperties.should.containEql('position.y');

			newOptions.points.id1.position.should.have.property('x', newValueX);
			newOptions.points.id1.position.should.have.property('y', newValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);

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
				effect = new MultiPointMoveEffect({
					'startTick' : tick,
					'endTick' : endTick,
					'points': {
								'id1' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : endTick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('position.x');
			result.updatedProperties.should.containEql('position.y');

			newOptions.points.id1.position.should.have.property('x', newValueX);
			newOptions.points.id1.position.should.have.property('y', newValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
		});

		it('Should return position.x in the array and modify start value if only position.x is passed by param in endTick', function() {
			var tick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.x' : newValue },
				effect = new MultiPointMoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('position.x');

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', newValue);
			newOptions.points.id2.position.should.have.property('y', oldValueY);
		});

		it('Should return position.y in the array and modify start value if only position.y is passed by param in endTick', function() {
			var tick = 10,
				oldValueX = 50,
				oldValueY = 100,
				newValue = 300,
				updatedPropertiesDiff = { 'position.y' : newValue },
				effect = new MultiPointMoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('position.y');

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', oldValueX);
			newOptions.points.id2.position.should.have.property('y', newValue);
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
				effect = new MultiPointMoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('position.x');
			result.updatedProperties.should.containEql('position.y');

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', newValueX);
			newOptions.points.id2.position.should.have.property('y', newValueY);
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
				effect = new MultiPointMoveEffect({
					'startTick' : 0,
					'endTick' : tick,
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										},
								'id2' : {
											'tick' : tick,
											'position' : {
												'x' : oldValueX,
												'y' : oldValueY
											}
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('position.x');
			result.updatedProperties.should.containEql('position.y');

			newOptions.points.id1.position.should.have.property('x', oldValueX);
			newOptions.points.id1.position.should.have.property('y', oldValueY);
			newOptions.points.id2.position.should.have.property('x', newValueX);
			newOptions.points.id2.position.should.have.property('y', newValueY);
		});
	});
});
