/*global describe, it */

'use strict';

var Rectangle = require('../../../src/shapes/rectangle'),
	should = require("should");

describe('Rectangle', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var instance = new Rectangle(),
				instance2 = new Rectangle();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});
		
		it('Should set default properties.', function(){
			var instance = new Rectangle(),
				properties = instance.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type','none');
			properties.border.should.have.property('color','black');

			properties.should.have.property('height', 100);
			properties.should.have.property('width', 100);
		});

		it('Should set the properties passed in the constructor.', function(){
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 42,
				specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedHeight = 32,
				specifiedWidth = 84,
				instance = new Rectangle({
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

			properties.should.have.property('height', specifiedHeight);
			properties.should.have.property('width', specifiedWidth);
		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function(){
			var specifiedBorderType = 'border',
				specifiedBorderColor = 'blue',
				specifiedHeight = 32,
				instance = new Rectangle({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					},
					height: specifiedHeight,
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

			properties.should.have.property('height', specifiedHeight);
			properties.should.have.property('width', 100);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var rec = new Rectangle({'prop' : 'value'}),
				json = rec.toJSON();

			json.should.have.property('properties');
			json.properties.should.have.property('position');
			json.properties.should.have.property('border');
			json.properties.should.have.property('fill');
			json.properties.should.have.property('prop','value');
		});

		it('fromJSON should load the object', function() { 
			var rec = new Rectangle({'prop' : 'value'}),
				json = rec.toJSON(),
				rec2 = new Rectangle();

			rec2.fromJSON(json);
			rec2.getGuid().should.equal(rec.getGuid());
			rec2.getProperties().should.have.property('prop', 'value');
		});
	});	
});