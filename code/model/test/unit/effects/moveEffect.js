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

	describe('getAffectedProperties', function(){
		it('Should return "position"', function(){
			var effect = new MoveEffect();
			var effectAffectedProperties = effect.getAffectedProperties();

			should(effectAffectedProperties)
				.be.instanceof(Array)
				.and.have.lengthOf(1);
			should(effectAffectedProperties)
				.containEql('position');
		});
	});

	describe('startTick', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var effect = new MoveEffect();

			effect.getOption('startTick').should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var startTick = 42,
				effect = new MoveEffect({ 'startTick' : startTick });

			effect.getOption('startTick').should.be.exactly(startTick);
		});
	});

	describe('endTick', function(){
		it('Should end at -1 if it not specified otherwise', function(){
			var effect = new MoveEffect();

			effect.getOption('endTick').should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function(){
			var endTick = 42,
				effect = new MoveEffect({ 'endTick' : endTick });

			effect.getOption('endTick').should.be.exactly(endTick);
		});
	});

	describe('getProperties()', function(){
		it('Should return the original tick not adding the x and y properties if path was not passed.', function(){
			var tick = 42,
				mediaFrameProperties = {},
				effect = new MoveEffect(),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.not.have.property('position');
		});

		it('Should return the original tick not updating the x and y properties if path was not passed.', function(){
			var tick = 42,
				x = 24,
				y = 32,
				mediaFrameProperties = { position : { 'x' : x, 'y' : y } },
				effect = new MoveEffect(),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', x);
			resultMediaFrameProperties.position.should.have.property('y', y);
		});

		it('Should return the original tick not adding the x and y properties if path was passed without the getPositionFor function.', function(){
			var tick = 42,
				mediaFrameProperties = {},
				path = {},
				effect = new MoveEffect({ 'path' : path }),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.not.have.property('position');
			resultMediaFrameProperties.should.not.have.properties('x', 'y');
		});

		it('Should return the original tick not updating the x and y properties if path was passed without the getPositionFor function.', function(){
			var tick = 42,
				x = 24,
				y = 32,
				mediaFrameProperties = { 'position' : { 'x' : x, 'y' : y } },
				path = {},
				effect = new MoveEffect({ 'path' : path }),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', x);
			resultMediaFrameProperties.position.should.have.property('y', y);
		});

		it('Should return the original tick with the new values.', function(){
			var tick = 42,
				x = 24,
				y = 32,
				mediaFrameProperties = { 'position' : { 'x' : x, 'y' : y } },
				resultX = x * 2,
				resultY = y * 2,
				path = { getPositionFor: function(startTick, endTick, currentTick) { return { 'x' : resultX, 'y' : resultY }; } },
				effect = new MoveEffect({ 'path' : path }),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', resultX);
			resultMediaFrameProperties.position.should.have.property('y', resultY);
		});

		it('Should retrive a copy of the original tick with no changes if the tick is before the startTick', function(){
			var tick = 42,
				startTick = 100,
				x = 24,
				y = 32,
				mediaFrameProperties = { 'position' : { 'x' : x, 'y' : y } },
				resultX = x * 2,
				resultY = y * 2,
				path = { getPositionFor: function(startTick, endTick, currentTick) { return { 'x' : resultX, 'y' : resultY }; } },
				effect = new MoveEffect({ 'startTick' : startTick, 'path' : path }),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);

			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', x);
			resultMediaFrameProperties.position.should.have.property('y', y);
		});

		it('Should retrive a copy of the end tick with no extra changes if the tick is after the endTick', function(){
			var tick = 42,
				endTick = 40,
				x = 24,
				y = 32,
				resultX = x * endTick,
				resultY = y * endTick,
				mediaFrameProperties = { position : { 'x' : x, 'y' : y } },
				path = { getPositionFor: function(startTick, endTick, currentTick) { return { x:(x*currentTick), y:(y*currentTick) }; } },
				effect = new MoveEffect({ 'endTick' : endTick, 'path' : path }),
				resultMediaFrameProperties = effect.getProperties(tick, mediaFrameProperties);

			should.strictEqual(resultMediaFrameProperties, mediaFrameProperties);
			resultMediaFrameProperties.should.have.property('position');
			resultMediaFrameProperties.position.should.have.property('x', resultX);
			resultMediaFrameProperties.position.should.have.property('y', resultY);
		});

		it('Should retrive a copy of the original tick with no changes if the tick is before the startTick (with endTick -1)');
		it('Should use always the current tick when the end tick is -1');
	});
});
