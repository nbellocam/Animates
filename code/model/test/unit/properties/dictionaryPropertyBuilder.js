/*global describe, it */

'use strict';

var DictionaryPropertyBuilder = require('../../../src/properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../../../src/properties/compositePropertyBuilder'),
	PropertyBuilder = require('../../../src/properties/propertyBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('DictionaryPropertyBuilder', function() {
	var complexValues = {
			'id1' : {
				'tick' : 100,
				'position' : {
					'x' : 10,
					'y' : 20
				}
			},
			'id2' : {
				'tick' : 500,
				'position' : {
					'x' : 44,
					'y' : 66
				}
			}
		},
		simpleValues = {
			'id1' : {
				'name' : 'FirstName'
			},
			'id2' : {
				'name' : 'SecondName'
			}
		};

	TypesManager.registerType('custom', []);

	it('Should create simple dictionary', function () {
		var propBuilder = new DictionaryPropertyBuilder();
		var properties = propBuilder
							.name('test')
							.schema(CompositePropertyBuilder)
								.property('name', PropertyBuilder)
									.type('custom')
								.add()
							.add()
							.values(simpleValues)
							.create();

		properties.names().should.have.lengthOf(2);
		properties.names().should.have.eql(['id1.name', 'id2.name']);
	});

	it('Should create a complex dictionary', function () {
		var propBuilder = new DictionaryPropertyBuilder();
		var properties = propBuilder
							.name('Points')
							.schema(CompositePropertyBuilder)
								.property('tick', PropertyBuilder)
									.type('float')
								.add()
								.property('position', CompositePropertyBuilder)
									.property('x', PropertyBuilder)
										.value(0)
										.type('float')
									.add()
									.property('y', PropertyBuilder)
										.value(0)
										.type('float')
									.add()
								.add()
							.add()
							.values(complexValues)
							.create();

		properties.names().should.have.lengthOf(6);
		properties.names().should.have.eql(['id1.tick', 'id1.position.x', 'id1.position.y',
											'id2.tick', 'id2.position.x', 'id2.position.y'
											]);

		properties.getValue('id1.tick').should.equal(100);
		properties.getValue('id1.position.x').should.equal(10);
		properties.getValue('id1.position.y').should.equal(20);

		properties.getValue('id2.tick').should.equal(500);
		properties.getValue('id2.position.x').should.equal(44);
		properties.getValue('id2.position.y').should.equal(66);

		// Another way of getting the same values
		properties.get('id2').getValue('position.x').should.equal(44);
	});
});