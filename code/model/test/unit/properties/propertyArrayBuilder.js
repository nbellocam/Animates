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
		}).should.throw(/^The property could not be built due to invalid value/);
	});

	it('Should return an array with only one property', function () {
		var propBuilder = new PropertiesArrayBuilder(),
			properties =	propBuilder
								.property('name')
									.type('custom')
									.value('value')
								.add()
							.create();

		properties.should.have.lengthOf(1);
	});
});