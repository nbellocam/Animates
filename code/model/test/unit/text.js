/*global describe, it */

'use strict';

var Text = require('../../src/text'),
	should = require("should");

describe('Text', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var text = new Text(),
				text2 = new Text();

			text.getGuid().should.have.type('string');
			text.getGuid().should.not.be.equal(text2.getGuid());
		});

		it('Should retrieve Text as type.', function() {
			var text = new Text();

			text.getType().should.be.equal('Text');
		});
		
		it('Should set default properties.', function() {
			var text = new Text();

			text.getProperty('position.x').should.equal(0);
			text.getProperty('position.y').should.equal(0);
			text.getProperty('position.z').should.equal(0);
			text.getProperty('opacity').should.equal(1);
			text.getProperty('border.type').should.equal('solid');
			text.getProperty('border.color').should.equal('#000000');

			text.getProperty('fontSize').should.equal(30);
			text.getProperty('fontWeight').should.equal('normal');
			text.getProperty('fontFamily').should.equal('Times New Roman');
			text.getProperty('fontStyle').should.equal('normal');
			text.getProperty('textDecoration').should.equal('');
			text.getProperty('text').should.equal('text');

		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedX = 1,
				specifiedY = 2,
				specifiedZ = 3,
				specifiedOpacity = 0.8,
				specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				text = new Text({
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
					fontSize : 20,
					fontWeight : 'bold',
					fontFamily : 'Verdana',
					fontStyle : 'italic',
					textDecoration : 'underline',
					text : 'Hola Mundo'
				});

			text.getProperty('position.x').should.equal(specifiedX);
			text.getProperty('position.y').should.equal(specifiedY);
			text.getProperty('position.z').should.equal(specifiedZ);
			text.getProperty('opacity').should.equal(specifiedOpacity);
			text.getProperty('border.type').should.equal(specifiedBorderType);
			text.getProperty('border.color').should.equal(specifiedBorderColor);

			text.getProperty('fontSize').should.equal(20);
			text.getProperty('fontWeight').should.equal('bold');
			text.getProperty('fontFamily').should.equal('Verdana');
			text.getProperty('fontStyle').should.equal('italic');
			text.getProperty('textDecoration').should.equal('underline');
			text.getProperty('text').should.equal('Hola Mundo');

		});

		it('Should set only the properties passed in the constructor and use the default for the rest.', function() {
			var specifiedBorderType = 'solid',
				specifiedBorderColor = 'blue',
				text = new Text({
					border : {
						type : specifiedBorderType,
						color : specifiedBorderColor
					}
				});

			text.getProperty('position.x').should.equal(0);
			text.getProperty('position.y').should.equal(0);
			text.getProperty('position.z').should.equal(0);
			text.getProperty('opacity').should.equal(1);
			text.getProperty('border.type').should.equal(specifiedBorderType);
			text.getProperty('border.color').should.equal(specifiedBorderColor);

			text.getProperty('fontSize').should.equal(30);
			text.getProperty('fontWeight').should.equal('normal');
			text.getProperty('fontFamily').should.equal('Times New Roman');
			text.getProperty('fontStyle').should.equal('normal');
			text.getProperty('textDecoration').should.equal('');
			text.getProperty('text').should.equal('text');

		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var rec = new Text({
							'fontSize' : 20,
							'fontWeight' : 'bold',
							'fontFamily' : 'Verdana',
							'fontStyle' : 'italic',
							'textDecoration' : 'underline',
							'text' : 'Hola Mundo'
						}),
				json = rec.toJSON();

			json.should.have.property('properties');
			json.properties.should.have.property('position');
			json.properties.should.have.property('border');
			json.properties.should.have.property('fill');
			json.properties.should.have.property('fontSize', 20);
			json.properties.should.have.property('fontWeight', 'bold');
			json.properties.should.have.property('fontFamily', 'Verdana');
			json.properties.should.have.property('fontStyle', 'italic');
			json.properties.should.have.property('textDecoration', 'underline');
			json.properties.should.have.property('text', 'Hola Mundo');

		});

		it('fromJSON should load the object', function() { 
			var rec = new Text({'text' : 'Hola Mundo'}),
				json = rec.toJSON(),
				rec2 = new Text();

			rec2.fromJSON(json);
			rec2.getGuid().should.equal(rec.getGuid());
			rec2.getProperties().should.have.property('fontSize', 30);
			rec2.getProperties().should.have.property('fontWeight', 'normal');
			rec2.getProperties().should.have.property('fontFamily', 'Times New Roman');
			rec2.getProperties().should.have.property('fontStyle', 'normal');
			rec2.getProperties().should.have.property('textDecoration', '');
			rec2.getProperties().should.have.property('text', 'Hola Mundo');
		});
	});	
});