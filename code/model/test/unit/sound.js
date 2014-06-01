/*global describe, it */

'use strict';

var Sound = require('../../src/sound'),
	should = require("should");

describe('Sound', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var sound = new Sound(),
				sound2 = new Sound();

			sound.getGuid().should.have.type('string');
			sound.getGuid().should.not.be.equal(sound2.getGuid());
		});

		it('Should set default properties.', function() {
			var sound = new Sound();

			sound.getProperty('source').should.equal('');
			sound.getProperty('volume').should.equal(100);
		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedVolumen = 42,
				specifiedSource = 'a source',
				sound = new Sound({
					volume: specifiedVolumen,
					source: specifiedSource
				});

			sound.getProperty('volume').should.equal(specifiedVolumen);
			sound.getProperty('source').should.equal(specifiedSource);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function() {
			var specifiedSource = 'a source',
				sound = new Sound({
					source: specifiedSource
				});

			sound.getProperty('volume').should.equal(100);
			sound.getProperty('source').should.equal(specifiedSource);
		});
	});
});