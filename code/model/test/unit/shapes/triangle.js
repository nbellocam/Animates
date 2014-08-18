/*global describe, it */

'use strict';

var Triangle = require('../../../src/shapes/triangle'),
	should = require("should");

describe('Triangle', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var triangle = new Triangle(),
				triangle2 = new Triangle();

			triangle.getGuid().should.have.type('string');
			triangle.getGuid().should.not.be.equal(triangle2.getGuid());
		});

		it('Should retrieve Triangle as type.', function() {
			var triangle = new Triangle();

			triangle.getType().should.be.equal('Triangle');
		});

		it('Should set default properties.', function() {
			var triangle = new Triangle();

			triangle.getProperty('position.x').should.equal(0);
			triangle.getProperty('position.y').should.equal(0);
			triangle.getProperty('position.z').should.equal(0);
			triangle.getProperty('opacity').should.equal(1);
			triangle.getProperty('border.type').should.equal('solid');
			triangle.getProperty('border.color').should.equal('#000000');

			triangle.getProperty('height').should.equal(100);
			triangle.getProperty('width').should.equal(100);

			triangle.getProperty('name').should.equal('Triangle');
		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.8,
				specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				specifiedHeight = 32,
				specifiedWidth = 84,
				triangle = new Triangle({
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

			triangle.getProperty('position.x').should.equal(specifiedX);
			triangle.getProperty('position.y').should.equal(specifiedY);
			triangle.getProperty('position.z').should.equal(specifiedZ);
			triangle.getProperty('opacity').should.equal(specifiedOpacity);
			triangle.getProperty('border.type').should.equal(specifiedBorderType);
			triangle.getProperty('border.color').should.equal(specifiedBorderColor);

			triangle.getProperty('height').should.equal(specifiedHeight);
			triangle.getProperty('width').should.equal(specifiedWidth);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function() {
			var specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				specifiedHeight = 32,
				triangle = new Triangle({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					height: specifiedHeight,
				});

			triangle.getProperty('position.x').should.equal(0);
			triangle.getProperty('position.y').should.equal(0);
			triangle.getProperty('position.z').should.equal(0);
			triangle.getProperty('opacity').should.equal(1);
			triangle.getProperty('border.type').should.equal(specifiedBorderType);
			triangle.getProperty('border.color').should.equal(specifiedBorderColor);

			triangle.getProperty('height').should.equal(specifiedHeight);
			triangle.getProperty('width').should.equal(100);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var rec = new Triangle({'height' : 200}),
				json = rec.toJSON();

			json.should.have.property('properties');
			json.properties.should.have.property('position');
			json.properties.should.have.property('border');
			json.properties.should.have.property('fill');
			json.properties.should.have.property('height', 200);
			json.properties.should.have.property('width', 100);
		});

		it('fromJSON should load the object', function() {
			var rec = new Triangle({'height' : 200}),
				json = rec.toJSON(),
				rec2 = new Triangle();

			rec2.fromJSON(json);
			rec2.getGuid().should.equal(rec.getGuid());
			rec2.getProperties().should.have.property('height', 200);
		});
	});
});
