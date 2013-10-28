/*global describe, it */

'use strict';

var Photo = require('../../src/sound'),
	should = require("should");

describe('Sound', function(){
	describe('Constructor', function(){
		it('Should set default properties', function(){
			var sound = new Sound(),
				properties = sound.getProperties();

			properties.should.have.property('source');
			properties.should.have.property('volumen');
		});
	});
});