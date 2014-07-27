/*global describe, it */

'use strict';

var Property = require('../../../src/properties/property'),
	PropertyBuilder = require('../../../src/properties/propertyBuilder'),
	CompositePropertyBuilder = require('../../../src/properties/compositePropertyBuilder'),
	DictionaryProperty = require('../../../src/properties/dictionaryProperty'),
	DictionaryPropertyBuilder = require('../../../src/properties/dictionaryPropertyBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('CompositePropertyBuilder', function() {

	TypesManager.registerType('custom', []);

	it('Should throw error due to an invalid value', function () {
		var propBuilder = new CompositePropertyBuilder();

		(function () {
			var properties = propBuilder
								.property('name', PropertyBuilder)
									.type('custom')
									.constraint(function () { return false; })
									.value('value')
								.add()
							.create();
		}).should.throw(/^The property 'name' could not be built due to invalid value/);
	});

	it('Should return an array with only one property', function () {
		var propBuilder = new CompositePropertyBuilder(),
			properties =	propBuilder
								.property('name', PropertyBuilder)
									.type('custom')
									.value('value')
								.add()
							.create();

		properties.length().should.equal(1);
		properties.getValue('name').should.equal('value');
	});

	it('Should accept building sub-properties', function () {
		var propBuilder = new CompositePropertyBuilder(),
			properties =	propBuilder
								.property('name', PropertyBuilder)
									.type('custom')
									.value('value')
								.add()
								.property('position', CompositePropertyBuilder)
									.property('x', PropertyBuilder)
										.type('custom')
										.value(100)
									.add()
									.property('y', PropertyBuilder)
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
		var propBuilder = new CompositePropertyBuilder(),
			properties =	propBuilder
								.property('name', PropertyBuilder)
									.type('custom')
									.value('value')
								.add()
								.property('position', CompositePropertyBuilder)
									.property('x', PropertyBuilder)
										.type('custom')
										.value(100)
									.add()
									.property('y', PropertyBuilder)
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
		var propBuilder = new CompositePropertyBuilder(),
			properties =	propBuilder
								.property('name', PropertyBuilder)
									.type('custom')
									.value('value')
								.add()
								.property('position', CompositePropertyBuilder)
									.property('x', PropertyBuilder)
										.type('custom')
										.value(100)
									.add()
									.property('y', PropertyBuilder)
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

	it('Should set properties and sub-properties values using a dictionary', function () {
		var propBuilder = new CompositePropertyBuilder(),
			values = {
				'1' : {
					position: {
						'x' : 10,
						'y'	: 20,
					},
					tick : 100
				},
				'2' : {
					position: {
						'x' : 30,
						'y'	: 40,
					},
					tick : 200
				},
			},
			properties =	propBuilder
								.property('points', DictionaryPropertyBuilder)
									.schema(CompositePropertyBuilder)
										.property('position', CompositePropertyBuilder)
											.property('x', PropertyBuilder)
												.type('float')
											.add()
											.property('y', PropertyBuilder)
												.type('float')
											.add()
										.add()
										.property('tick', PropertyBuilder)
											.type('float')
										.add()
									.add()
									.values(values)
								.add()
							.create();

			properties.names().should.have.lengthOf(6);
			properties.names().should.eql(['points.1.position.x', 'points.1.position.y', 'points.1.tick', 'points.2.position.x', 'points.2.position.y', 'points.2.tick']);
	});

	it('Should should add a new guid if not exists with a complex schema', function () {
		var builder = new CompositePropertyBuilder(),
			schema = new CompositePropertyBuilder(),
			properties;

		// Define the schema
		properties =	builder
							.property('path', PropertyBuilder)
									.value('Straight')
									.type('string')
									.constraint(function (val) { return (['Straight'].indexOf(val) >= 0); })
								.add()
								.property('points', DictionaryPropertyBuilder)
									.schema(CompositePropertyBuilder)
										.property('position', CompositePropertyBuilder)
											.property('x', PropertyBuilder)
												.type('float')
											.add()
											.property('y', PropertyBuilder)
												.type('float')
											.add()
										.add()
										.property('tick', PropertyBuilder)
											.type('float')
										.add()
									.add()
									.values([])
								.add()
							.create();

		// Try to add the value
		properties.setValue('points.a6d8297d-b31e-43a3-a8e0-8cafffd50910', { tick: 5, position: { x: 300, y: 40 } });
		properties.getValue('points.a6d8297d-b31e-43a3-a8e0-8cafffd50910.tick').should.equal(5);
	});
});