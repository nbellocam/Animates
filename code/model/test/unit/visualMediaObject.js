/*global describe, it */

'use strict';

var VisualMediaObject = require('../../src/visualMediaObject'),
	should = require("should");

describe('VisualMediaObject', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var instance = new VisualMediaObject(),
				instance2 = new VisualMediaObject();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});
		
		it('Should set default properties.', function() {
			var visualMediaObject = new VisualMediaObject();

			visualMediaObject.getProperty('position.x').should.equal(0);
			visualMediaObject.getProperty('position.y').should.equal(0);
			visualMediaObject.getProperty('position.z').should.equal(0);
			visualMediaObject.getProperty('opacity').should.equal(1);
			visualMediaObject.getProperty('border.type').should.equal('solid');
			visualMediaObject.getProperty('border.color').should.equal('#000000');
		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.5,
				specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				visualMediaObject = new VisualMediaObject({
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

			visualMediaObject.getProperty('position.x').should.equal(specifiedX);
			visualMediaObject.getProperty('position.y').should.equal(specifiedY);
			visualMediaObject.getProperty('position.z').should.equal(specifiedZ);
			visualMediaObject.getProperty('opacity').should.equal(specifiedOpacity);
			visualMediaObject.getProperty('border.type').should.equal(specifiedBorderType);
			visualMediaObject.getProperty('border.color').should.equal(specifiedBorderColor);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function() {
			var specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				visualMediaObject = new VisualMediaObject({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					}
				});

			visualMediaObject.getProperty('position.x').should.equal(0);
			visualMediaObject.getProperty('position.y').should.equal(0);
			visualMediaObject.getProperty('position.z').should.equal(0);
			visualMediaObject.getProperty('opacity').should.equal(1);
			visualMediaObject.getProperty('border.type').should.equal(specifiedBorderType);
			visualMediaObject.getProperty('border.color').should.equal(specifiedBorderColor);
		});
	});
});