/*global describe, it */

'use strict';

var Property = require('../../../src/properties/property'),
	PropertyBuilder = require('../../../src/properties/propertyBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('PropertyBuilder', function() {
	function constraintStringA (val) {
		return val.indexOf('A') >= 0;
	}

	function constraintStringB (val) {
		return val.indexOf('B') >= 0;
	}

	function constraintStringC (val) {
		return val.indexOf('C') === 0;
	}

	TypesManager.registerType('custom', []);
	TypesManager.registerType('stringA', [ constraintStringA ]);
	TypesManager.registerType('stringB', [ constraintStringB ], function (val) { return val; }, 'stringA');

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

		}).should.throw(/^The property 'name' could not be built due to invalid value/);
	});

	it('Should throw error due to missing type', function () {
		var propBuilder = new PropertyBuilder(),
			prop;

		(function () {
			prop = propBuilder
						.name('name')
						.value('test')
						.create();

		}).should.throw(/^The property 'name' could not be built because the type was not defined./);
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
			prop = propBuilder
						.name('name')
						.type('stringB')
						.value('CAB')
						.constraint(constraintStringC)
						.create();

			// Invalid values
			prop.value('A');
			prop.isValid().should.not.be.ok;

			prop.value('B');
			prop.isValid().should.not.be.ok;

			prop.value('C');
			prop.isValid().should.not.be.ok;

			prop.value('AB');
			prop.isValid().should.not.be.ok;

			prop.value('AC');
			prop.isValid().should.not.be.ok;

			prop.value('BA');
			prop.isValid().should.not.be.ok;

			prop.value('BC');
			prop.isValid().should.not.be.ok;

			prop.value('CA');
			prop.isValid().should.not.be.ok;

			prop.value('CB');
			prop.isValid().should.not.be.ok;

			prop.value('ABC');
			prop.isValid().should.not.be.ok;

			prop.value('ACB');
			prop.isValid().should.not.be.ok;

			prop.value('BCA');
			prop.isValid().should.not.be.ok;

			prop.value('BAC');
			prop.isValid().should.not.be.ok;

			// Valid values
			prop.value('CAB');
			prop.isValid().should.be.ok;

			prop.value('CBA');
			prop.isValid().should.be.ok;

	});
});