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

	describe('startTick', function(){
		it('Should start at 0 if it not specified otherwise.', function(){
			var effect = new Effect();

			effect.startTick.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor.', function(){
			var startTick = 42,
				effect = new Effect({ 'startTick' : startTick });

			effect.startTick.should.be.exactly(startTick);
		});
	});

	describe('endTick', function(){
		it('Should end at -1 if it not specified otherwise.', function(){
			var effect = new Effect(),
				endTick = effect.endTick;

			endTick.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor.', function(){
			var endTick = 42,
				effect = new Effect({ 'endTick' : endTick });

			effect.endTick.should.be.exactly(endTick);
		});
	});

	describe('getPropertiesF()', function(){
		it('Should return the original frame.', function(){
			var tick = 42,
				mediaFrame = {},
				effect = new Effect(),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});

		it('Should return the original frame even with the frame after the end frame.', function(){
			var endTick = 42,
				tick = 100,
				mediaFrame = {},
				effect = new Effect({ 'endTick' : endTick }),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});

		it('Should return the original frame specially with the frame before the start frame.', function(){
			var startTick = 100,
				tick = 42,
				mediaFrame = {},
				effect = new Effect({ 'startTick' : startTick }),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});
	});
});
