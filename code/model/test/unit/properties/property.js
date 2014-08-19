/*global describe, it */

'use strict';

var Property = require('../../../src/properties/property'),
	should = require("should");

describe('Property', function() {
	
	var mockType = { 'isValid' : function () { return true; }};
	var options = { 'type' : mockType };

	it('Should set the value', function () {
		var prop = new Property(options);

		prop.value('test');
		prop.value().should.equal('test');
	});

	it('Should be valid without from scratch', function () {
		var prop = new Property(options);

		prop.isValid().should.be.ok;

		prop.value('test');

		prop.isValid().should.be.ok;
	});

	it('Should not be valid when any constraint fails ', function () {
		var trueConstraint = function (val) { return true; },
			falseConstraint = function (val) { return false; },
			prop = new Property({ type: mockType, constraints : [trueConstraint, falseConstraint] });

		prop.value('test', true);

		prop.isValid().should.not.be.ok;
	});

	it('Should throw and exception when an invalid property value is set without the avoidvalidation parameter ', function () {
		var trueConstraint = function (val) { return true; },
			falseConstraint = function (val) { return false; },
			prop = new Property({ type: mockType, constraints : [trueConstraint, falseConstraint] });

		(function () {
			prop.value('test');

		}).should.throw(/^The value "test" is not valid for the property ""/);
	});

	it('Should not be valid when all constraint fails ', function () {
		var falseConstraint = function (val) { return false; },
			prop = new Property({ type: mockType, constraints : [falseConstraint, falseConstraint] });

		prop.value('test', true);

		prop.isValid().should.not.be.ok;
	});

	it('Should be valid when all constraint passes ', function () {
		var trueConstraint = function (val) { return true; },
			prop = new Property({ type: mockType, constraints : [trueConstraint, trueConstraint] });

		prop.value('test');

		prop.isValid().should.be.ok;
	});

	it('Should create a clone', function () {
		var trueConstraint = function (val) { return true; },
			prop = new Property({ type: mockType, constraints : [trueConstraint, trueConstraint] }),
			propClone;

		prop.value('originalValue');

		propClone = prop.clone();

		prop.value().should.equal('originalValue');
		propClone.value().should.equal('originalValue');

		prop.value('newValue');

		prop.value().should.equal('newValue');
		propClone.value().should.equal('originalValue');

		propClone.value('newClonedValue');

		prop.value().should.equal('newValue');
		propClone.value().should.equal('newClonedValue');

		prop.isValid().should.be.ok;
	});
});