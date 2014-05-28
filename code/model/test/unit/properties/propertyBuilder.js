/*global describe, it */

'use strict';

var Property = require('../../../src/properties/property'),
	PropertyBuilder = require('../../../src/properties/propertyBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('PropertyBuilder', function() {

	TypesManager.registerType('custom', []);
	TypesManager.registerType('myString', [ function (val) { return val !== ''; } ]);
	TypesManager.registerType('myStringLimited', [ function (val) { return val.length < 7; } ], 'myString');

	it('Should throw error due to missing type', function () {
		var propBuilder = new PropertyBuilder(),
			prop;

		(function () {
			prop = propBuilder
						.value('test')
						.create();

		}).should.throw(/^The property could not be built because it does not have a name/);
	});

	it('Should throw error due to an unregistered type', function () {
		var propBuilder = new PropertyBuilder();

		(function () {
			propBuilder
				.name('name')
				.type('myType')
				.value('test')
				.constraint(function(val) { return false; })
				.create();

		}).should.throw(/^The type 'myType' is not registered/);
	});

	it('Should throw error due to an invalid value', function () {
		var propBuilder = new PropertyBuilder();

		(function () {
			propBuilder
				.name('name')
				.type('custom')
				.value('test')
				.constraint(function(val) { return false; })
				.create();

		}).should.throw(/^The property could not be built due to invalid value/);
	});

	it('Should throw error due to missing type', function () {
		var propBuilder = new PropertyBuilder(),
			prop;

		(function () {
			prop = propBuilder
						.name('name')
						.value('test')
						.create();

		}).should.throw(/^The property could not be built because the type was not defined./);
	});

	it('Should create the property according to its options', function () {
		var propBuilder = new PropertyBuilder(),
			prop;

			prop = propBuilder
						.name('name')
						.type('custom')
						.value('test')
						.constraint(function(val) { return val === 'test'; })
						.create();

			prop.value().should.equal('test');
			prop.isValid().should.be.ok;
	});

	it('Should create the property according to its types', function () {
		var propBuilder = new PropertyBuilder(),
			prop;
			prop = propBuilder
						.name('name')
						.type('myStringLimited')
						.value('test')
						.constraint(function(val) { return val.indexOf('test') === 0; })
						.create();

			prop.value().should.equal('test');
			prop.isValid().should.be.ok;

			prop.value('testverylong');
			prop.isValid().should.not.be.ok;

			prop.value('');
			prop.isValid().should.not.be.ok;
	});
});