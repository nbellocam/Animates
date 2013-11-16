/*global describe, it */

'use strict';

var Effect = require('../../src/effect'),
	should = require("should");

describe('Effect', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var effect1 = new Effect(),
				effect2 = new Effect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});

	describe('startFrame', function(){
		it('Should start at 0 if it not specified otherwise.', function(){
			var effect = new Effect(),
				startFrameNumber = effect.startFrameNumber;

			startFrameNumber.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor.', function(){
			var specifiedInitialFrameNumber = 42,
				effect = new Effect({ startFrameNumber : specifiedInitialFrameNumber }),
				startFrameNumber = effect.startFrameNumber;

			startFrameNumber.should.be.exactly(specifiedInitialFrameNumber);
		});
	});

	describe('endFrame', function(){
		it('Should end at -1 if it not specified otherwise.', function(){
			var effect = new Effect(),
				endFrameNumber = effect.endFrameNumber;

			endFrameNumber.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor.', function(){
			var specifiedEndFrameNumber = 42,
				effect = new Effect({ endFrameNumber : specifiedEndFrameNumber }),
				endFrameNumber = effect.endFrameNumber;

			endFrameNumber.should.be.exactly(specifiedEndFrameNumber);
		});
	});

	describe('getPropertiesForFrame()', function(){
		it('Should return the original frame.', function(){
			var specifiedFrame = 42,
				mediaFrame = {},
				effect = new Effect(),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, mediaFrame);

			should.strictEqual(endShapeFrame, mediaFrame);
		});

		it('Should return the original frame even with the frame after the end frame.', function(){
			var specifiedEndFrameNumber = 42,
				specifiedFrameNumber = 100,
				mediaFrame = {},
				effect = new Effect({ endFrameNumber : specifiedEndFrameNumber }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrame);

			should.strictEqual(endShapeFrame, mediaFrame);
		});

		it('Should return the original frame specially with the frame before the start frame.', function(){
			var specifiedInitialFrameNumber = 100,
				specifiedFrameNumber = 42,
				mediaFrame = {},
				effect = new Effect({ startFrameNumber : specifiedInitialFrameNumber }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrameNumber, mediaFrame);

			should.strictEqual(endShapeFrame, mediaFrame);
		});
	});
});
