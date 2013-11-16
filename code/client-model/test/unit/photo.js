/*global describe, it */

'use strict';

var Photo = require('../../src/photo'),
	should = require("should");

describe('Photo', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var instance = new Photo(),
				instance2 = new Photo();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});
		
		it('Should set default properties', function(){
			var photo = new Photo(),
				properties = photo.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type','none');
			properties.border.should.have.property('color','black');

			properties.should.have.property('source');
		});

		it('Should set the properties passed in the constructor.', function(){
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 42,
				specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedSource = 'a source',
				instance = new Photo({
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
				}),
				properties = instance.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', specifiedX);
			properties.position.should.have.property('y', specifiedY);
			properties.position.should.have.property('z', specifiedZ);
			properties.should.have.property('opacity', specifiedOpacity);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedBorderType);
			properties.border.should.have.property('color', specifiedBorderColor);

			properties.should.have.property('source', specifiedSource);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function(){
			var specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedSource = 'a source',
				instance = new Photo({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					source: specifiedSource
				}),
				properties = instance.getProperties();


			properties.should.have.property('position');
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedBorderType);
			properties.border.should.have.property('color', specifiedBorderColor);

			properties.should.have.property('source', specifiedSource);
		});
	});
});