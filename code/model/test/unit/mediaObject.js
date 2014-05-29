/*global describe, it */

'use strict';

var MediaObject = require('../../src/mediaObject'),
	PropertiesArrayBuilder = require('../../src/properties/propertiesArrayBuilder'),
	should = require("should");

describe('MediaObject', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var mediaObject = new MediaObject(),
				mediaObject2 = new MediaObject();

			mediaObject.getGuid().should.have.type('string');
			mediaObject.getGuid().should.not.be.equal(mediaObject2.getGuid());
		});
	});

	describe('getProperties', function(){
		it('Should return an empty object is no option is passed as parameter.', function(){
			var instance = new MediaObject(),
				properties = instance.getProperties();

			properties.should.be.empty;
		});

		it('Should return empty even if an option is passed by parameter.', function(){
			var	instance = new MediaObject({propertyName: 'specifiedPropertyValue'}),
				properties = instance.getProperties();

			properties.should.be.empty;
		});
	});

	describe('getProperty', function(){
		it('Should throw an error if the property does not exits.', function(){
			var instance = new MediaObject();

			(function () {
				instance.getProperty('invalidProperty');
			}).should.throw(/^Property 'invalidProperty' could not be found/);
		});

		it('Should throw an error if parent property is empty.', function(){
			var instance = new MediaObject();

			(function () {
				instance.getProperty('parentPropertyName.innerPropertyName');
			}).should.throw(/^Property 'parentPropertyName' could not be found/);
		});

		it('Should throw an error if inner property is empty.', function(){
			var propertyBuilder = new PropertiesArrayBuilder(),
				instance;

			propertyBuilder
				.propertyArray('parentPropertyName')
					.property('inner')
						.type('string')
						.value('text')
					.add()
				.add();

			instance = new MediaObject({}, propertyBuilder);

			(function () {
				instance.getProperty('parentPropertyName.innerPropertyName');
			}).should.throw(/^Property 'innerPropertyName' could not be found/);
		});

		it('Should return the property if it exits.', function(){
			var propertyBuilder = new PropertiesArrayBuilder(),
				instance;

			propertyBuilder
				.property('prop')
					.type('string')
					.value('text')
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.getProperty('prop').should.equal('text');
		});

		it('Should return the inner property if it exits.', function(){
			var propertyBuilder = new PropertiesArrayBuilder(),
				instance;

			propertyBuilder
				.propertyArray('parentPropertyName')
					.property('inner')
						.type('string')
						.value('text')
					.add()
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.getProperty('parentPropertyName.inner').should.equal('text');
		});
	});

	describe('setProperty', function(){
		it('Should throw an error if the property does not exits.', function(){
			var instance = new MediaObject();

			(function () {
				instance.setProperty('parentPropertyName', 'text');
			}).should.throw(/^Property 'parentPropertyName' could not be found/);
		});

		it('Should update a property if it already exits.', function(){
			var propertyBuilder = new PropertiesArrayBuilder(),
				instance;

			propertyBuilder
				.property('prop')
					.type('string')
					.value('text')
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.setProperty('prop', 'newText');

			instance.getProperty('prop').should.equal('newText');
		});

		it('Should throw an exception if the property does not exits.', function(){
			var propertyBuilder = new PropertiesArrayBuilder(),
				instance;

			propertyBuilder
				.property('prop')
					.type('string')
					.value('text')
				.add();

			instance = new MediaObject({}, propertyBuilder);

			(function () {
				instance.setProperty('parentPropertyName', 'text');
			}).should.throw(/^Property 'parentPropertyName' could not be found/);
		});

		it('Should update a inner property if it already exits.', function(){
			var propertyBuilder = new PropertiesArrayBuilder(),
				instance;

			propertyBuilder
				.propertyArray('parentPropertyName')
					.property('inner')
						.type('string')
						.value('text')
					.add()
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.getProperty('parentPropertyName.inner').should.equal('text');		

			instance.setProperty('parentPropertyName.inner', 'newText');

			instance.getProperty('parentPropertyName.inner').should.equal('newText');
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var propertyBuilder = new PropertiesArrayBuilder(),
				mediaObject,
				json;


			propertyBuilder
				.property('prop')
					.type('string')
					.value('text')
				.add();

			mediaObject = new MediaObject({}, propertyBuilder);
			
			json = mediaObject.toJSON();

			json.should.have.property('properties');
		});

		it('fromJSON should load the object', function() { 
			var propertyBuilder = new PropertiesArrayBuilder(),
				propertyBuilder2 = new PropertiesArrayBuilder(),
				mediaObject,
				json,
				mediaObject2;

			propertyBuilder
				.property('prop')
					.type('string')
					.value('value')
				.add();

			propertyBuilder2
				.property('prop')
					.type('string')
					.value('no-value')
				.add();

			mediaObject = new MediaObject({}, propertyBuilder);
			json = mediaObject.toJSON();
			
			mediaObject2 = new MediaObject({}, propertyBuilder2);
			mediaObject2.fromJSON(json);
			
			mediaObject2.getGuid().should.equal(mediaObject.getGuid());
			mediaObject2.getProperties().should.have.property('prop', 'value');
		});
	});	
});