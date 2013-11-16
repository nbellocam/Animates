/*global describe, it */

'use strict';

var VisualMediaObject = require('../../src/visualMediaObject'),
	should = require("should");

describe('VisualMediaObject', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var instance = new VisualMediaObject(),
				instance2 = new VisualMediaObject();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});
		
		it('Should set default properties.', function(){
			var visualMediaObject = new VisualMediaObject(),
				properties = visualMediaObject.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type','none');
			properties.border.should.have.property('color','black');
		});

		it('Should set the properties passed in the constructor.', function(){
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 42,
				specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				instance = new VisualMediaObject({
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
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function(){
			var specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				instance = new VisualMediaObject({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					}
				}),
				properties = instance.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', 0);
			properties.position.should.have.property('y', 0);
			properties.position.should.have.property('z', 0);
			properties.should.have.property('opacity', 1);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedBorderType);
			properties.border.should.have.property('color', specifiedBorderColor);
		});
	});
});