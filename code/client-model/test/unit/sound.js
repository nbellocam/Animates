/*global describe, it */

'use strict';

var Sound = require('../../src/sound'),
	should = require("should");

describe('Sound', function(){
	describe('Constructor', function(){
		it('Should generate a random guid', function(){
			var instance = new Sound(),
				instance2 = new Sound();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});

		it('Should set default properties', function(){
			var sound = new Sound(),
				properties = sound.getProperties();

			properties.should.have.property('source');
			properties.should.have.property('volumen');
		});
	});
});