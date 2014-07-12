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
				'postion' : {
					'x' : 10,
					'y' : 20
				}
			},
			'id2' : {
				'tick' : 500,
				'postion' : {
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
});