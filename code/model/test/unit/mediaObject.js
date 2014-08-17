/*global describe, it */

'use strict';

var MediaObject = require('../../src/mediaObject'),
	PropertyBuilder = require('../../src/properties/propertyBuilder'),
	CompositePropertyBuilder = require('../../src/properties/compositePropertyBuilder'),
	should = require("should");

describe('MediaObject', function() {
	describe('constructor', function() {
		it('Should generate a random guid.', function() {
			var mediaObject = new MediaObject(),
				mediaObject2 = new MediaObject();

			mediaObject.getGuid().should.have.type('string');
			mediaObject.getGuid().should.not.be.equal(mediaObject2.getGuid());
		});

		it('Should set default properties.', function() {
			var mediaObject = new MediaObject();
			mediaObject.getProperty('name').should.equal('Object');
		});

		it('Should set the properties passed in the constructor.', function() {
			var specifiedName = 'new name',
				visualMediaObject = new MediaObject({
					name : specifiedName
				});

			visualMediaObject.getProperty('name').should.equal(specifiedName);
		});
	});

	describe('getProperty', function() {
		it('Should throw an error if the property does not exits.', function() {
			var instance = new MediaObject();

			(function () {
				instance.getProperty('invalidProperty');
			}).should.throw(/^Property 'invalidProperty' could not be found/);
		});

		it('Should throw an error if parent property is empty.', function() {
			var instance = new MediaObject();

			(function () {
				instance.getProperty('parentPropertyName.innerPropertyName');
			}).should.throw(/^Property 'parentPropertyName' could not be found/);
		});

		it('Should throw an error if inner property is empty.', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				instance;

			propertyBuilder
				.property('parentPropertyName', CompositePropertyBuilder)
					.property('inner', PropertyBuilder)
						.type('string')
						.value('text')
					.add()
				.add();

			instance = new MediaObject({}, propertyBuilder);

			(function () {
				instance.getProperty('parentPropertyName.innerPropertyName');
			}).should.throw(/^Property 'innerPropertyName' could not be found/);
		});

		it('Should return the property if it exits.', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				instance;

			propertyBuilder
				.property('prop', PropertyBuilder)
					.type('string')
					.value('text')
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.getProperty('prop').should.equal('text');
		});

		it('Should return the inner property if it exits.', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				instance;

			propertyBuilder
				.property('parentPropertyName', CompositePropertyBuilder)
					.property('inner', PropertyBuilder)
						.type('string')
						.value('text')
					.add()
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.getProperty('parentPropertyName.inner').should.equal('text');
		});
	});

	describe('setProperty', function() {
		it('Should throw an error if the property does not exits.', function() {
			var instance = new MediaObject();

			(function () {
				instance.setProperty('parentPropertyName', 'text');
			}).should.throw(/^Property 'parentPropertyName' could not be found/);
		});

		it('Should update a property if it already exits.', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				instance;

			propertyBuilder
				.property('prop', PropertyBuilder)
					.type('string')
					.value('text')
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.setProperty('prop', 'newText');

			instance.getProperty('prop').should.equal('newText');
		});

		it('Should throw an exception if the property does not exits.', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				instance;

			propertyBuilder
				.property('prop', PropertyBuilder)
					.type('string')
					.value('text')
				.add();

			instance = new MediaObject({}, propertyBuilder);

			(function () {
				instance.setProperty('parentPropertyName', 'text');
			}).should.throw(/^Property 'parentPropertyName' could not be found/);
		});

		it('Should update a inner property if it already exits.', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				instance;

			propertyBuilder
				.property('parentPropertyName', CompositePropertyBuilder)
					.property('inner', PropertyBuilder)
						.type('string')
						.value('text')
					.add()
				.add();

			instance = new MediaObject({}, propertyBuilder);

			instance.getProperty('parentPropertyName.inner').should.equal('text');

			instance.setProperty('parentPropertyName.inner', 'newText');

			instance.getProperty('parentPropertyName.inner').should.equal('newText');
		});

		describe('getPropertiesSchema', function () {
			it('Should return clone of its properties', function () {
				var propertyBuilder = new CompositePropertyBuilder(),
					instance,
					schema;

				propertyBuilder
					.property('parentPropertyName', CompositePropertyBuilder)
						.property('inner', PropertyBuilder)
							.type('string')
							.value('text')
						.add()
					.add();

				instance = new MediaObject({}, propertyBuilder);

				schema = instance.getPropertiesSchema();

				schema.names().should.have.lengthOf(2);
				schema.names().should.containEql('parentPropertyName.inner', 'name');
			});
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				mediaObject,
				json;


			propertyBuilder
				.property('prop', PropertyBuilder)
					.type('string')
					.value('text')
				.add();

			mediaObject = new MediaObject({}, propertyBuilder);

			json = mediaObject.toJSON();

			json.should.have.property('properties');
		});

		it('fromJSON should load the object', function() {
			var propertyBuilder = new CompositePropertyBuilder(),
				propertyBuilder2 = new CompositePropertyBuilder(),
				mediaObject,
				json,
				mediaObject2;

			propertyBuilder
				.property('prop', PropertyBuilder)
					.type('string')
					.value('value')
				.add();

			propertyBuilder2
				.property('prop', PropertyBuilder)
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
