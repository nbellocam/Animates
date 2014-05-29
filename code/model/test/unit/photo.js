/*global describe, it */

'use strict';

var Photo = require('../../src/photo'),
	should = require("should");

describe('Photo', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var photo = new Photo(),
				photo2 = new Photo();

			photo.getGuid().should.have.type('string');
			photo.getGuid().should.not.be.equal(photo2.getGuid());
		});
		
		it('Should set default properties', function(){
			var photo = new Photo();

			photo.getProperty('position.x').should.equal(0);
			photo.getProperty('position.y').should.equal(0);
			photo.getProperty('position.z').should.equal(0);
			photo.getProperty('opacity').should.equal(1);
			photo.getProperty('border.type').should.equal('none');
			photo.getProperty('border.color').should.equal('black');
			photo.getProperty('source').should.equal('');
		});

		it('Should set the properties passed in the constructor.', function(){
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.9,
				specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedSource = 'a source',
				photo = new Photo({
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
					source: specifiedSource
				});

			photo.getProperty('position.x').should.equal(specifiedX);
			photo.getProperty('position.y').should.equal(specifiedY);
			photo.getProperty('position.z').should.equal(specifiedZ);
			photo.getProperty('opacity').should.equal(specifiedOpacity);
			photo.getProperty('border.type').should.equal(specifiedBorderType);
			photo.getProperty('border.color').should.equal(specifiedBorderColor);
			photo.getProperty('source').should.equal(specifiedSource);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function(){
			var specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedSource = 'a source',
				photo = new Photo({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					source: specifiedSource
				});


			photo.getProperty('position.x').should.equal(0);
			photo.getProperty('position.y').should.equal(0);
			photo.getProperty('position.z').should.equal(0);
			photo.getProperty('opacity').should.equal(1);
			photo.getProperty('border.type').should.equal(specifiedBorderType);
			photo.getProperty('border.color').should.equal(specifiedBorderColor);
			photo.getProperty('source').should.equal(specifiedSource);
		});
	});
});