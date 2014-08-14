/*global describe, it */

'use strict';

var Circle = require('../../../src/shapes/circle'),
	should = require("should");

describe('Circle', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var circle = new Circle(),
				circle2 = new Circle();

			circle.getGuid().should.have.type('string');
			circle.getGuid().should.not.be.equal(circle2.getGuid());
		});

		it('Should retrieve Circle as type.', function() {
			var circle = new Circle();

			circle.getType().should.be.equal('Circle');
		});
		
		it('Should set default properties.', function() {
			var circle = new Circle();

			circle.getProperty('position.x').should.equal(0);
			circle.getProperty('position.y').should.equal(0);
			circle.getProperty('position.z').should.equal(0);
			circle.getProperty('opacity').should.equal(1);
			circle.getProperty('border.type').should.equal('solid');
			circle.getProperty('border.color').should.equal('#000000');

			circle.getProperty('radius').should.equal(50);
		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.8,
				specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				specifiedRadius = 32,
				circle = new Circle({
					position : {
						x : specifiedX,
						y : specifiedY,
						z : specifiedZ
					},
					opacity: specifiedOpacity,
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					radius: specifiedRadius,
				});

			circle.getProperty('position.x').should.equal(specifiedX);
			circle.getProperty('position.y').should.equal(specifiedY);
			circle.getProperty('position.z').should.equal(specifiedZ);
			circle.getProperty('opacity').should.equal(specifiedOpacity);
			circle.getProperty('border.type').should.equal(specifiedBorderType);
			circle.getProperty('border.color').should.equal(specifiedBorderColor);

			circle.getProperty('radius').should.equal(specifiedRadius);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function() {
			var specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				specifiedRadius = 32,
				circle = new Circle({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					radius: specifiedRadius,
				});

			circle.getProperty('position.x').should.equal(0);
			circle.getProperty('position.y').should.equal(0);
			circle.getProperty('position.z').should.equal(0);
			circle.getProperty('opacity').should.equal(1);
			circle.getProperty('border.type').should.equal(specifiedBorderType);
			circle.getProperty('border.color').should.equal(specifiedBorderColor);

			circle.getProperty('radius').should.equal(specifiedRadius);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var rec = new Circle({'radius' : 200}),
				json = rec.toJSON();

			json.should.have.property('properties');
			json.properties.should.have.property('position');
			json.properties.should.have.property('border');
			json.properties.should.have.property('fill');
			json.properties.should.have.property('radius', 200);
		});

		it('fromJSON should load the object', function() { 
			var rec = new Circle({'radius' : 200}),
				json = rec.toJSON(),
				rec2 = new Circle();

			rec2.fromJSON(json);
			rec2.getGuid().should.equal(rec.getGuid());
			rec2.getProperties().should.have.property('radius', 200);
		});
	});	
});