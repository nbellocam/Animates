/*global describe, it */

'use strict';

var Shape = require('../../src/shape'),
	should = require("should");

describe('Shape', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var instance = new Shape(),
				instance2 = new Shape();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});

		it('Should set default properties.', function(){
			var shape = new Shape();

			shape.getProperty('position.x').should.equal(0);
			shape.getProperty('position.y').should.equal(0);
			shape.getProperty('position.z').should.equal(0);
			shape.getProperty('opacity').should.equal(1);
			shape.getProperty('border.type').should.equal('none');
			shape.getProperty('border.color').should.equal('black');
		});

		it('Should set the properties passed in the constructor.', function(){
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.5,
				specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				shape = new Shape({
					position : {
						x : specifiedX,
						y : specifiedY,
						z : specifiedZ
					},
					opacity: specifiedOpacity,
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					}
				});

			shape.getProperty('position.x').should.equal(specifiedX);
			shape.getProperty('position.y').should.equal(specifiedY);
			shape.getProperty('position.z').should.equal(specifiedZ);
			shape.getProperty('opacity').should.equal(specifiedOpacity);
			shape.getProperty('border.type').should.equal(specifiedBorderType);
			shape.getProperty('border.color').should.equal(specifiedBorderColor);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function(){
			var specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				shape = new Shape({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					}
				});

			shape.getProperty('position.x').should.equal(0);
			shape.getProperty('position.y').should.equal(0);
			shape.getProperty('position.z').should.equal(0);
			shape.getProperty('opacity').should.equal(1);
			shape.getProperty('border.type').should.equal(specifiedBorderType);
			shape.getProperty('border.color').should.equal(specifiedBorderColor);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var shape = new Shape(),
				json = shape.toJSON();

			json.should.have.property('properties');
			json.properties.should.have.property('opacity');
			json.properties.should.have.property('position');
			json.properties.should.have.property('fill');
			json.properties.should.have.property('border');
			json.properties.should.have.property('angle');
		});

		it('fromJSON should load the object', function() { 
			var shape = new Shape({'opacity' : 0}),
				json = shape.toJSON(),
				shape2 = new Shape();

			shape2.fromJSON(json);
			shape2.getGuid().should.equal(shape.getGuid());
			shape2.getProperties().should.have.property('opacity', 0);
		});
	});	
});