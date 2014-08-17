/*global describe, it */

'use strict';

var MultiPointRotateEffect = require('../../../src/effects/multiPointRotateEffect'),
	should = require("should");

describe('MultiPointRotateEffect', function() {
	describe('constructor', function() {
		it('Should generate a random guid', function() {
			var effect1 = new MultiPointRotateEffect(),
				effect2 = new MultiPointRotateEffect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});

	describe('getType', function() {
		it('Should retrieve MultiPointRotateEffect as type.', function() {
			var instance = new MultiPointRotateEffect();

			instance.getType().should.be.equal('MultiPointRotateEffect');
		});
	});


	describe('getAffectedProperties', function() {
		it('Should return "angle"', function() {
			var effect = new MultiPointRotateEffect();
			var effectAffectedProperties = effect.getAffectedProperties();

			should(effectAffectedProperties)
				.be.instanceof(Array)
				.and.have.lengthOf(2);
			should(effectAffectedProperties)
				.eql(['angle' , 'motion']);
		});
	});

	describe('getProperties()', function() {
		it('Should retrive the original mediaFrame with the last angle if the tick is before the endTick.', function() {
			var tick = 100,
				resultAngle = 10,
				mediaFrameProperties = { 'angle' : 10 },
				effect = new MultiPointRotateEffect({
					'path' : 'Straight',
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : 0,
										},
								'id2' : {
											'tick' : tick,
											'angle' : 10,
											'motion' : 'clockwise'
										}
								}
				}),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('angle');
			resultMediaFrameProperties.angle.should.eql(10);
		});
	});


	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var effect = new MultiPointRotateEffect(
								{
									'points': {
											'id1' : {
														'tick' : 5,
														'angle' : 0,
														'motion' : 'clockwise'
													},
											'id2' : {
														'tick' : 100,
														'angle' : 10,
														'motion' : 'counter-clockwise'
													}
										}
								}),
				json = effect.toJSON().options;

			json.should.have.property('points');
			json.points.id1.tick.should.equal(5);
			json.points.id1.angle.should.equal(0);
			json.points.id1.motion.should.equal('clockwise');
			json.points.id2.tick.should.equal(100);
			json.points.id2.angle.should.equal(10);
			json.points.id2.motion.should.equal('counter-clockwise');
		});

		it('fromJSON should load the object', function() {
			var effect = new MultiPointRotateEffect(
								{
									'points': {
											'id1' : {
														'tick' : 5,
														'angle' : 0,
														'motion' : 'clockwise'
													},
											'id2' : {
														'tick' : 100,
														'angle' : 10,
														'motion' : 'counter-clockwise'
													}
										}
								}),
				json = effect.toJSON(),
				effect2 = new MultiPointRotateEffect(),
				deserializedOptions;

			effect2.fromJSON(json);
			effect2.getGuid().should.equal(effect.getGuid());
			deserializedOptions = effect2.getOptions();
			deserializedOptions.points.id1.tick.should.equal(5);
			deserializedOptions.points.id1.angle.should.equal(0);
			deserializedOptions.points.id1.motion.should.equal('clockwise');
			deserializedOptions.points.id2.tick.should.equal(100);
			deserializedOptions.points.id2.angle.should.equal(10);
			deserializedOptions.points.id2.motion.should.equal('counter-clockwise');
		});
	});

	describe('updateProperties', function() {
		it('Should return empty array and not modify the angle if an empty list of points is defined', function() {
			var tick = 5,
				updatedPropertiesDiff = { },
				effect = new MultiPointRotateEffect({
					'path' : 'Straight',
					'points': {}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff);

			result.updatedProperties.should.have.length(0);
		});

		it('Should return empty array and not modify the angle if an empty list properties was passed by param', function() {
			var tick = 5,
				firstAngle = 50,
				secondAngle = 100,
				rotation = 'clockwise',
				updatedPropertiesDiff = { },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : tick,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(0);

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql('clockwise');
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});


		it('Should return empty array and not modify any point if a not applying list of properties was passed by param', function() {
			var tick = 5,
				firstAngle = 50,
				secondAngle = 100,
				rotation = 'clockwise',
				updatedPropertiesDiff = { 'useless' : 'property' },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : tick,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(0);

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql('clockwise');
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});

		it('Should return angle, motion and add a new point if the tick is between first tick and second tick in the effect', function() {
			var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				rotation = 'clockwise',
				updatedPropertiesDiff = { 'angle' : 35 },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : 10,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('angle');
			result.updatedProperties.should.containEql('motion');

			Object.keys(newOptions.points).should.have.lengthOf(3);
			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql('clockwise');
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});

		it('Should return angle in the array and modify first point value if only angle is passed by param in first point tick', function() {
			var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				rotation = 'clockwise',
				updatedPropertiesDiff = { 'angle' : newAngle },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : tick,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : 10,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('angle');

			newOptions.points.id1.angle.should.eql(newAngle);
			newOptions.points.id1.motion.should.eql('clockwise');
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});

		it('Should return motion in the array and modify first point value if only motion is passed by param in first point tick', function() {
			var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = { 'motion' : newRotation },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : tick,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : 10,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('motion');

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql(newRotation);
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});

		it('Should return both position in the array and modify start values if both positions are passed by param in startTick', function() {
			var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = { 'angle' : newAngle, 'motion' : newRotation },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : tick,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : 10,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('motion');
			result.updatedProperties.should.containEql('angle');

			newOptions.points.id1.angle.should.eql(newAngle);
			newOptions.points.id1.motion.should.eql(newRotation);
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});

		it('Should return both angle, motion in the array and modify start values if both positions are passed by param in startTick with more properties', function() {
			var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = { 'useless' : 'property', 'angle' : newAngle, 'motion' : newRotation },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : tick,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : 10,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('motion');
			result.updatedProperties.should.containEql('angle');

			newOptions.points.id1.angle.should.eql(newAngle);
			newOptions.points.id1.motion.should.eql(newRotation);
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql('clockwise');
		});

		it('Should return angle in the array and modify start value if only angle is passed by param in endTick', function() {
			var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = {'angle' : newAngle },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : tick,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('angle');

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql(rotation);
			newOptions.points.id2.angle.should.eql(newAngle);
			newOptions.points.id2.motion.should.eql(rotation);
		});

		it('Should return motion in the array and modify start value if only motion is passed by param in endTick', function() {
				var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = {'motion' : newRotation },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : tick,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(1);
			result.updatedProperties.should.containEql('motion');

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql(rotation);
			newOptions.points.id2.angle.should.eql(secondAngle);
			newOptions.points.id2.motion.should.eql(newRotation);
		});

		it('Should return both angle, motion in the array and modify start values if both angle,motion are passed by param in endTick', function() {
				var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = {'motion' : newRotation, 'angle' : newAngle },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : tick,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('motion');
			result.updatedProperties.should.containEql('angle');

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql(rotation);
			newOptions.points.id2.angle.should.eql(newAngle);
			newOptions.points.id2.motion.should.eql(newRotation);
		});

		it('Should return both angle,motion in the array and modify start values if both angle,motion are passed by param in endTick with more properties', function() {
				var tick = 3,
				firstAngle = 50,
				secondAngle = 100,
				newAngle = 35,
				newRotation = 'counter-clockwise',
				rotation = 'clockwise',
				updatedPropertiesDiff = {'uesless' : 'property', 'motion' : newRotation, 'angle' : newAngle },
				effect = new MultiPointRotateEffect({
					'points': {
								'id1' : {
											'tick' : 0,
											'angle' : firstAngle
										},
								'id2' : {
											'tick' : tick,
											'angle' : secondAngle,
											'motion' : rotation
										}	
								}
				}),
				result = effect.updateProperties(tick, updatedPropertiesDiff),
				newOptions = effect.toJSON().options;

			result.updatedProperties.should.have.length(2);
			result.updatedProperties.should.containEql('motion');
			result.updatedProperties.should.containEql('angle');

			newOptions.points.id1.angle.should.eql(firstAngle);
			newOptions.points.id1.motion.should.eql(rotation);
			newOptions.points.id2.angle.should.eql(newAngle);
			newOptions.points.id2.motion.should.eql(newRotation);
		});
	});
});
