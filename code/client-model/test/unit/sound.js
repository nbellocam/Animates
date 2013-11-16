/*global describe, it */

'use strict';

var Sound = require('../../src/sound'),
	should = require("should");

describe('Sound', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var instance = new Sound(),
				instance2 = new Sound();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});

		it('Should set default properties.', function(){
			var sound = new Sound(),
				properties = sound.getProperties();

			properties.should.have.property('source', '');
			properties.should.have.property('volumen', 100);
		});

		it('Should set the properties passed in the constructor.', function(){
			var specifiedVolumen = 42,
				specifiedSource = 'a source',
				instance = new Sound({
					volumen: specifiedVolumen,
					source: specifiedSource
				}),
				properties = instance.getProperties();

			properties.should.have.property('source', specifiedSource);
			properties.should.have.property('volumen', specifiedVolumen);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function(){
			var specifiedSource = 'a source',
				instance = new Sound({
					source: specifiedSource
				}),
				properties = instance.getProperties();

			properties.should.have.property('source', specifiedSource);
			properties.should.have.property('volumen', 100);
		});
	});
});