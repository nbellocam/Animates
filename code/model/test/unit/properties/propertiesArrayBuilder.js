/*global describe, it */

'use strict';

var Property = require('../../../src/properties/property'),
	PropertiesArrayBuilder = require('../../../src/properties/propertiesArrayBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('PropertiesArrayBuilder', function() {

	TypesManager.registerType('custom', []);

	it('Should throw error due to an invalid value', function () {
		var propBuilder = new PropertiesArrayBuilder();

		(function () {
			var properties = propBuilder
								.property('name')
									.type('custom')
									.constraint(function () { return false; })
									.value('value')
								.add()
							.create();
		}).should.throw(/^The property 'name' could not be built due to invalid value/);
	});

	it('Should return an array with only one property', function () {
		var propBuilder = new PropertiesArrayBuilder(),
			properties =	propBuilder
								.property('name')
									.type('custom')
									.value('value')
								.add()
							.create();

		properties.length().should.equal(1);
		properties.getValue('name').should.equal('value');
	});

	it('Should accept building sub-properties', function () {
		var propBuilder = new PropertiesArrayBuilder(),
			properties =	propBuilder
								.property('name')
									.type('custom')
									.value('value')
								.add()
								.propertyArray('position')
									.property('x')
										.type('custom')
										.value(100)
									.add()
									.property('y')
										.type('custom')
										.value(1000)
									.add()
								.add()
							.create();

		properties.length().should.equal(2);
		properties.names().should.containEql('name', 'position.x', 'position.y');
		properties.getValue('name').should.equal('value');
		properties.getValue('position.x').should.equal(100);
		properties.getValue('position.y').should.equal(1000);
	});

	it('Should throw an error with inexistent properties', function () {
		var propBuilder = new PropertiesArrayBuilder(),
			properties =	propBuilder
								.property('name')
									.type('custom')
									.value('value')
								.add()
								.propertyArray('position')
									.property('x')
										.type('custom')
										.value(100)
									.add()
									.property('y')
										.type('custom')
										.value(1000)
									.add()
								.add()
							.create();

		(function () {
			properties.getValue('position.x.decimals');
		}).should.throw(/^Property 'decimals' could not be found/);

		(function () {
			properties.getValue('missing');
		}).should.throw(/^Property 'missing' could not be found/);

		(function () {
			properties.getValue('position.z');
		}).should.throw(/^Property 'z' could not be found/);
	});

	it('Should set properties and sub-properties values', function () {
		var propBuilder = new PropertiesArrayBuilder(),
			properties =	propBuilder
								.property('name')
									.type('custom')
									.value('value')
								.add()
								.propertyArray('position')
									.property('x')
										.type('custom')
										.value(100)
									.add()
									.property('y')
										.type('custom')
										.value(1000)
									.add()
								.add()
							.create();

		properties.getValue('name').should.equal('value');
		properties.getValue('position.x').should.equal(100);
		properties.getValue('position.y').should.equal(1000);

		properties.setValue('name', 'newValue');
		properties.setValue('position.x', 200);
		properties.setValue('position.y', 3000);

		properties.getValue('name').should.equal('newValue');
		properties.getValue('position.x').should.equal(200);
		properties.getValue('position.y').should.equal(3000);
	});
});