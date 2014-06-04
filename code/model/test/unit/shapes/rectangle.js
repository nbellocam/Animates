/*global describe, it */

'use strict';

var Rectangle = require('../../../src/shapes/rectangle'),
	should = require("should");

describe('Rectangle', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var rectangle = new Rectangle(),
				rectangle2 = new Rectangle();

			rectangle.getGuid().should.have.type('string');
			rectangle.getGuid().should.not.be.equal(rectangle2.getGuid());
		});

		it('Should retrieve Rectangle as type.', function() {
			var rectangle = new Rectangle();

			rectangle.getType().should.be.equal('Rectangle');
		});
		
		it('Should set default properties.', function() {
			var rectangle = new Rectangle();

			rectangle.getProperty('position.x').should.equal(0);
			rectangle.getProperty('position.y').should.equal(0);
			rectangle.getProperty('position.z').should.equal(0);
			rectangle.getProperty('opacity').should.equal(1);
			rectangle.getProperty('border.type').should.equal('none');
			rectangle.getProperty('border.color').should.equal('#000000');

			rectangle.getProperty('height').should.equal(100);
			rectangle.getProperty('width').should.equal(100);
		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.8,
				specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedHeight = 32,
				specifiedWidth = 84,
				rectangle = new Rectangle({
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
					height: specifiedHeight,
					width: specifiedWidth
				});

			rectangle.getProperty('position.x').should.equal(specifiedX);
			rectangle.getProperty('position.y').should.equal(specifiedY);
			rectangle.getProperty('position.z').should.equal(specifiedZ);
			rectangle.getProperty('opacity').should.equal(specifiedOpacity);
			rectangle.getProperty('border.type').should.equal(specifiedBorderType);
			rectangle.getProperty('border.color').should.equal(specifiedBorderColor);

			rectangle.getProperty('height').should.equal(specifiedHeight);
			rectangle.getProperty('width').should.equal(specifiedWidth);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function() {
			var specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedHeight = 32,
				rectangle = new Rectangle({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					height: specifiedHeight,
				});

			rectangle.getProperty('position.x').should.equal(0);
			rectangle.getProperty('position.y').should.equal(0);
			rectangle.getProperty('position.z').should.equal(0);
			rectangle.getProperty('opacity').should.equal(1);
			rectangle.getProperty('border.type').should.equal(specifiedBorderType);
			rectangle.getProperty('border.color').should.equal(specifiedBorderColor);

			rectangle.getProperty('height').should.equal(specifiedHeight);
			rectangle.getProperty('width').should.equal(100);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var rec = new Rectangle({'height' : 200}),
				json = rec.toJSON();

			json.should.have.property('properties');
			json.properties.should.have.property('position');
			json.properties.should.have.property('border');
			json.properties.should.have.property('fill');
			json.properties.should.have.property('height', 200);
			json.properties.should.have.property('width', 100);
		});

		it('fromJSON should load the object', function() { 
			var rec = new Rectangle({'height' : 200}),
				json = rec.toJSON(),
				rec2 = new Rectangle();

			rec2.fromJSON(json);
			rec2.getGuid().should.equal(rec.getGuid());
			rec2.getProperties().should.have.property('height', 200);
		});
	});	
});