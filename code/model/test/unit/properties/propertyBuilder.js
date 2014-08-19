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

	it('Should create the property with strictValues', function () {
		var propBuilder = new PropertyBuilder(),
			prop;

			prop = propBuilder
						.name('Letters')
						.type('custom')
						.value('A')
						.strictValues(['A', 'B', 'C'])
						.create();

			prop.isStrict().should.be.ok;
			prop.value().should.equal('A');
			prop.isValid().should.be.ok;
			prop.value('D', true);
			prop.isValid().should.not.be.ok;
			prop.strictValues().should.containEql('A');
			prop.strictValues().should.containEql('B');
			prop.strictValues().should.containEql('C');
	});

	it('Should create the property according to its types', function () {
		var propBuilder = new PropertyBuilder(),
			prop = propBuilder
						.name('OnlyCAtIndex0AndB')
						.type('stringB')
						.value('CAB')
						.constraint(constraintStringC)
						.create();

			// Invalid values
			prop.value('A', true);
			prop.isValid().should.not.be.ok;

			prop.value('B', true);
			prop.isValid().should.not.be.ok;

			prop.value('C', true);
			prop.isValid().should.not.be.ok;

			prop.value('AB', true);
			prop.isValid().should.not.be.ok;

			prop.value('AC', true);
			prop.isValid().should.not.be.ok;

			prop.value('BA', true);
			prop.isValid().should.not.be.ok;

			prop.value('BC', true);
			prop.isValid().should.not.be.ok;

			prop.value('CA', true);
			prop.isValid().should.not.be.ok;

			prop.value('CB', true);
			prop.isValid().should.not.be.ok;

			prop.value('ABC', true);
			prop.isValid().should.not.be.ok;

			prop.value('ACB', true);
			prop.isValid().should.not.be.ok;

			prop.value('BCA', true);
			prop.isValid().should.not.be.ok;

			prop.value('BAC', true);
			prop.isValid().should.not.be.ok;

			// Valid values
			prop.value('CAB');
			prop.isValid().should.be.ok;

			prop.value('CBA');
			prop.isValid().should.be.ok;

	});
});