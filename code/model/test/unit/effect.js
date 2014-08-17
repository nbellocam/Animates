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

	describe('isInfinite', function () {
		it('Should return true', function () {
			var effect = new Effect();
			effect.isInfinite().should.be.ok;
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

	describe('getProperties()', function() {
		it('Should return the original frame.', function() {
			var tick = 42,
				mediaFrame = {},
				effect = new Effect(),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});

		it('Should return the original frame even for big ticks.', function() {
			var tick = 1000,
				mediaFrame = {},
				effect = new Effect(),
				mediaFrameProperties = effect.getProperties(tick, mediaFrame);

			should.strictEqual(mediaFrameProperties, mediaFrame);
		});

		it('Should return the original frame specially for the frame 0.', function() {
			var tick = 0,
				mediaFrame = {},
				effect = new Effect(),
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
		});

		it('fromJSON should load the object', function() {
			var effect = new Effect(),
				json = effect.toJSON(),
				effect2 = new Effect();

			effect2.fromJSON(json);
			effect2.getGuid().should.equal(effect.getGuid());
		});
	});
});
