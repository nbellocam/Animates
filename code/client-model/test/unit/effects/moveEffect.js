/*global describe, it */

'use strict';

var MoveEffect = require('../../../src/effects/moveEffect'),
	should = require("should");

describe('MoveEffect', function(){
	describe('constructor', function(){
		it('Should generate a random guid', function(){
			var effect1 = new MoveEffect(),
				effect2 = new MoveEffect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});
	
	describe('startFrameNumber', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var effect = new MoveEffect(),
				startFrameNumber = effect.startFrameNumber;

			startFrameNumber.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedStartFrameNumber = 42,
				effect = new MoveEffect({ startFrameNumber : specifiedStartFrameNumber }),
				startFrameNumber = effect.startFrameNumber;

			startFrameNumber.should.be.exactly(specifiedStartFrameNumber);
		});
	});

	describe('endFrameNumber', function(){
		it('Should end at -1 if it not specified otherwise', function(){
			var effect = new MoveEffect(),
				endFrameNumber = effect.endFrameNumber;

			endFrameNumber.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function(){
			var specifiedStartFrameNumber = 42,
				effect = new MoveEffect({ endFrameNumber : specifiedStartFrameNumber }),
				endFrameNumber = effect.endFrameNumber;

			endFrameNumber.should.be.exactly(specifiedStartFrameNumber);
		});
	});

	describe('getPropertiesForFrame()', function(){
		it('Should return the original frame not adding the x and y properties if path was not passed.', function(){
			var specifiedFrameNumber = 42,
				mediaFrameProperties = {},
				effect = new MoveEffect(),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.not.have.properties('x', 'y');
		});

		it('Should return the original frame not updating the x and y properties if path was not passed.', function(){
			var specifiedFrameNumber = 42,
				specifiedX = 24,
				specifiedY = 32,
				mediaFrameProperties = { position : { x:specifiedX, y:specifiedY } },
				effect = new MoveEffect(),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', specifiedX);
			resultMediaFrameProperties.position.should.have.property('y', specifiedY);
		});

		it('Should return the original frame not adding the x and y properties if path was passed without the getPositionFor function.', function(){
			var specifiedFrameNumber = 42,
				mediaFrameProperties = {},
				specifiedPath = {},
				effect = new MoveEffect({ path: specifiedPath }),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.not.have.property('position');
			resultMediaFrameProperties.should.not.have.properties('x', 'y');
		});

		it('Should return the original frame not updating the x and y properties if path was passed without the getPositionFor function.', function(){
			var specifiedFrameNumber = 42,
				specifiedX = 24,
				specifiedY = 32,
				mediaFrameProperties = { position : { x:specifiedX, y:specifiedY } },
				specifiedPath = {},
				effect = new MoveEffect({ path: specifiedPath }),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', specifiedX);
			resultMediaFrameProperties.position.should.have.property('y', specifiedY);
		});

		it('Should return the original frame with the new values.', function(){
			var specifiedFrameNumber = 42,
				specifiedX = 24,
				specifiedY = 32,
				mediaFrameProperties = { position : { x:specifiedX, y:specifiedY } },
				resultX = specifiedX * 2,
				resultY = specifiedY * 2,
				specifiedPath = { getPositionFor: function(startFrameNumber, endFrameNumber, currentFrame) { return { x:resultX, y:resultY }; } },
				effect = new MoveEffect({ path: specifiedPath }),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', resultX);
			resultMediaFrameProperties.position.should.have.property('y', resultY);
		});

		it('Should retrive a copy of the original frame with no changes if the frame is before the initialFrame', function(){
			var specifiedFrameNumber = 42,
				specifiedStartFrameNumber = 100,
				specifiedX = 24,
				specifiedY = 32,
				mediaFrameProperties = { position : { x:specifiedX, y:specifiedY } },
				resultX = specifiedX * 2,
				resultY = specifiedY * 2,
				specifiedPath = { getPositionFor: function(startFrameNumber, endFrameNumber, currentFrame) { return { x:resultX, y:resultY }; } },
				effect = new MoveEffect({ startFrameNumber : specifiedStartFrameNumber, path: specifiedPath }),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', specifiedX);
			resultMediaFrameProperties.position.should.have.property('y', specifiedY);
		});

		it('Should retrive a copy of the end frame with no extra changes if the frame is after the endFrameNumber', function(){
			var specifiedFrameNumber = 42,
				specifiedEndFrameNumber = 40,
				specifiedX = 24,
				specifiedY = 32,
				resultX = specifiedX * specifiedEndFrameNumber,
				resultY = specifiedY * specifiedEndFrameNumber,
				mediaFrameProperties = { position : { x:specifiedX, y:specifiedY } },
				specifiedPath = { getPositionFor: function(startFrameNumber, endFrameNumber, currentFrame) { return { x:(specifiedX*currentFrame), y:(specifiedY*currentFrame) }; } },
				effect = new MoveEffect({ endFrameNumber : specifiedEndFrameNumber, path: specifiedPath }),
				resultMediaFrameProperties = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', resultX);
			resultMediaFrameProperties.position.should.have.property('y', resultY);
		});

		it('Should retrive a copy of the original frame with no changes if the frame is before the initialFrame (with endFrame -1)');
		it('Should use always the current frame when the end frame is -1');
	});
});
