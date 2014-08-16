/*global describe, it */

'use strict';

var Effect = require('../../src/effect'),
	should = require("should");

describe('Effect', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var effect1 = new Effect(),
				effect2 = new Effect();

			effect1.getGuid().should.have.type('string');
			effect1.getGuid().should.not.be.equal(effect2.getGuid());
		});
	});

	describe('getCommonAffectedProperties', function() {
		it('Should return empty array', function() {
			var effect = new Effect(),
				effect2 = new Effect();

			(effect.getCommonAffectedProperties(effect2))
				.should.be.empty;
		});

		it('Should return common properties', function() {
			var effect = new Effect(),
				effect2 = new Effect(),
				commonProperties;

			effect.getAffectedProperties = function () {return ['a', 'b'];};
			effect2.getAffectedProperties = function () {return ['b'];};
			commonProperties = effect.getCommonAffectedProperties(effect2);

			commonProperties.should.have.lengthOf(1);
			commonProperties.should.containEql('b');

			commonProperties = effect2.getCommonAffectedProperties(effect);

			commonProperties.should.have.lengthOf(1);
			commonProperties.should.containEql('b');

			effect.getAffectedProperties = function () {return ['a', 'b'];};
			effect2.getAffectedProperties = function () {return ['b', 'a'];};
			commonProperties = effect.getCommonAffectedProperties(effect2);

			commonProperties.should.have.lengthOf(2);
			commonProperties.should.containEql('b');
			commonProperties.should.containEql('a');
		});
	});

	describe('getOption', function () {
		it('Should return the value for existant custom options', function () {
			var effect = new Effect({'startTick' : 100});
			effect.getOption('startTick').should.equal(100);
		});
	});

	describe('setOption', function () {
		it('Should return update extistant options values', function () {
			var effect = new Effect({'startTick' : 100});
			effect.setOption('startTick', 200);
			effect.getOption('startTick').should.equal(200);
		});
	});

	describe('getOptions', function () {
		it('Should return all default options', function () {
			var effect = new Effect(),
				options = effect.getOptions();

			options.should.have.property('endTick');
			options.should.have.property('startTick');
		});
	});

	describe('HasConflictWithProperties', function () {
		it('Should indicate conflict without strict', function() {
			var effect = new Effect(),
				effect2 = new Effect(),
				commonProperties;

			effect.getAffectedProperties = function () {return ['a', 'b'];};
			effect2.getAffectedProperties = function () {return ['b'];};

			effect.HasConflictWithProperties(effect2).should.be.ok;
			effect2.HasConflictWithProperties(effect).should.be.ok;
		});

		it('Should not indicate conflict without strict', function() {
			var effect = new Effect(),
				effect2 = new Effect(),
				commonProperties;

			effect.getAffectedProperties = function () {return ['a', 'b'];};
			effect2.getAffectedProperties = function () {return ['c'];};

			effect.HasConflictWithProperties(effect2).should.not.be.ok;
			effect2.HasConflictWithProperties(effect).should.not.be.ok;
		});

		it('Should indicate conflict with strict', function() {
			var effect = new Effect(),
				effect2 = new Effect(),
				commonProperties;

			effect.getAffectedProperties = function () {return ['a', 'b'];};
			effect2.getAffectedProperties = function () {return ['b', 'a'];};

			effect.HasConflictWithProperties(effect2, true).should.be.ok;
			effect2.HasConflictWithProperties(effect, true).should.be.ok;
		});

		it('Should not indicate conflict with strict', function() {
			var effect = new Effect(),
				effect2 = new Effect(),
				commonProperties;

			effect.getAffectedProperties = function () {return ['a', 'b'];};
			effect2.getAffectedProperties = function () {return ['a', 'b', 'c'];};

			effect.HasConflictWithProperties(effect2, true).should.not.be.ok;
			effect2.HasConflictWithProperties(effect, true).should.not.be.ok;
		});
	});

	describe('startTick', function() {
		it('Should start at 0 if it not specified otherwise.', function() {
			var effect = new Effect();

			effect.getOption('startTick').should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor.', function() {
			var startTick = 42,
				effect = new Effect({ 'startTick' : startTick });

			effect.getOption('startTick').should.be.exactly(startTick);
		});
	});

	describe('endTick', function() {
		it('Should end at 100 if it not specified otherwise.', function() {
			var effect = new Effect();

			effect.getOption('endTick').should.be.exactly(100);
		});

		it('Should end at the value specified using the constructor.', function() {
			var endTick = 42,
				effect = new Effect({ 'endTick' : endTick });

			effect.getOption('endTick').should.be.exactly(endTick);
		});
	});

	describe('getPropertiesF()', function() {
		it('Should return the original frame.', function() {
			var tick = 42,
				mediaFrame = {},
				effect = new Effect(),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});

		it('Should return the original frame even with the frame after the end frame.', function() {
			var endTick = 42,
				tick = 100,
				mediaFrame = {},
				effect = new Effect({ 'endTick' : endTick }),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});

		it('Should return the original frame specially with the frame before the start frame.', function() {
			var startTick = 100,
				tick = 42,
				mediaFrame = {},
				effect = new Effect({ 'startTick' : startTick }),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var effect = new Effect(),
				pepe = effect.getOptions(),
				json = effect.toJSON();

			json.should.have.keys('options', 'guid');
			json.options.should.have.keys('startTick', 'endTick');
		});

		it('fromJSON should load the object', function() {
			var effect = new Effect({ 'startTick' : 100, 'endTick' : 200 }),
				json = effect.toJSON(),
				effect2 = new Effect();

			effect2.fromJSON(json);
			effect2.getGuid().should.equal(effect.getGuid());
			effect2.getOptions().should.have.property('startTick', 100);
			effect2.getOptions().should.have.property('endTick', 200);
		});
	});
});
