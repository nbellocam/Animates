/*global require, describe, it */

var Common = require('../src/common'),
	assert = require("assert"),
	should = require("should");

describe('Common', function(){
	describe('#createShortGuid', function(){
		it('should match the guid regex', function(){
			var guid = Common.createGuid();

			guid.should.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
		});
	});

	describe('#typeOf', function(){
		it('should only return null with null or undefined objects', function(){
			should.equal(Common.typeOf(null), null);
			should.equal(Common.typeOf(undefined), null);

			should.notEqual(Common.typeOf(1), null);
			should.notEqual(Common.typeOf(-1), null);
			should.notEqual(Common.typeOf(NaN), null);
			should.notEqual(Common.typeOf(Infinity), null);
			should.notEqual(Common.typeOf(-Infinity), null);
			should.notEqual(Common.typeOf("text"), null);
			should.notEqual(Common.typeOf([]), null);
			should.notEqual(Common.typeOf(true), null);
			should.notEqual(Common.typeOf(false), null);
			should.notEqual(Common.typeOf(function () {}), null);
			should.notEqual(Common.typeOf(function fun () {}), null);
			should.notEqual(Common.typeOf({}), null);
			should.notEqual(Common.typeOf(new Date()), null);
		});

		it("should only return 'string' with string literals", function(){
			should.equal(Common.typeOf("text"), 'string');

			should.notEqual(Common.typeOf(null), 'string');
			should.notEqual(Common.typeOf(undefined), 'string');
			should.notEqual(Common.typeOf(1), 'string');
			should.notEqual(Common.typeOf(-1), 'string');
			should.notEqual(Common.typeOf(NaN), 'string');
			should.notEqual(Common.typeOf(Infinity), 'string');
			should.notEqual(Common.typeOf(-Infinity), 'string');
			should.notEqual(Common.typeOf([]), 'string');
			should.notEqual(Common.typeOf(true), 'string');
			should.notEqual(Common.typeOf(false), 'string');
			should.notEqual(Common.typeOf(function () {}), 'string');
			should.notEqual(Common.typeOf(function fun () {}), 'string');
			should.notEqual(Common.typeOf({}), 'string');
			should.notEqual(Common.typeOf(new Date()), 'string');
		});

		it("should only return 'boolean' with boolean literals", function(){
			should.equal(Common.typeOf(true), 'boolean');
			should.equal(Common.typeOf(false), 'boolean');

			should.notEqual(Common.typeOf(null), 'boolean');
			should.notEqual(Common.typeOf(undefined), 'boolean');
			should.notEqual(Common.typeOf(1), 'boolean');
			should.notEqual(Common.typeOf(-1), 'boolean');
			should.notEqual(Common.typeOf(NaN), 'boolean');
			should.notEqual(Common.typeOf(Infinity), 'boolean');
			should.notEqual(Common.typeOf(-Infinity), 'boolean');
			should.notEqual(Common.typeOf("text"), 'boolean');
			should.notEqual(Common.typeOf([]), 'boolean');
			should.notEqual(Common.typeOf(function () {}), 'boolean');
			should.notEqual(Common.typeOf(function fun () {}), 'boolean');
			should.notEqual(Common.typeOf({}), 'boolean');
			should.notEqual(Common.typeOf(new Date()), 'boolean');
		});

		it("should only return 'date' with date objects", function(){
			should.equal(Common.typeOf(new Date()), 'date');

			should.notEqual(Common.typeOf(null), 'date');
			should.notEqual(Common.typeOf(undefined), 'date');
			should.notEqual(Common.typeOf(1), 'date');
			should.notEqual(Common.typeOf(-1), 'date');
			should.notEqual(Common.typeOf(NaN), 'date');
			should.notEqual(Common.typeOf(Infinity), 'date');
			should.notEqual(Common.typeOf(-Infinity), 'date');
			should.notEqual(Common.typeOf("text"), 'date');
			should.notEqual(Common.typeOf([]), 'date');
			should.notEqual(Common.typeOf(true), 'date');
			should.notEqual(Common.typeOf(false), 'date');
			should.notEqual(Common.typeOf(function () {}), 'date');
			should.notEqual(Common.typeOf(function fun () {}), 'date');
			should.notEqual(Common.typeOf({}), 'date');
		});

		it("should only return 'array' with array objects", function(){
			should.equal(Common.typeOf([]), 'array');

			should.notEqual(Common.typeOf(null), 'array');
			should.notEqual(Common.typeOf(undefined), 'array');
			should.notEqual(Common.typeOf(1), 'array');
			should.notEqual(Common.typeOf(-1), 'array');
			should.notEqual(Common.typeOf(NaN), 'array');
			should.notEqual(Common.typeOf(Infinity), 'array');
			should.notEqual(Common.typeOf(-Infinity), 'array');
			should.notEqual(Common.typeOf("text"), 'array');
			should.notEqual(Common.typeOf(true), 'array');
			should.notEqual(Common.typeOf(false), 'array');
			should.notEqual(Common.typeOf(function () {}), 'array');
			should.notEqual(Common.typeOf(function fun () {}), 'array');
			should.notEqual(Common.typeOf({}), 'array');
			should.notEqual(Common.typeOf(new Date()), 'array');
		});

		it("should only return 'number' with number and NaN objects", function(){
			should.equal(Common.typeOf(1), 'number');
			should.equal(Common.typeOf(-1), 'number');
			should.equal(Common.typeOf(NaN), 'number');
			should.equal(Common.typeOf(Infinity), 'number');
			should.equal(Common.typeOf(-Infinity), 'number');


			should.notEqual(Common.typeOf(null), 'number');
			should.notEqual(Common.typeOf(undefined), 'number');
			should.notEqual(Common.typeOf("text"), 'number');
			should.notEqual(Common.typeOf([]), 'number');
			should.notEqual(Common.typeOf(true), 'number');
			should.notEqual(Common.typeOf(false), 'number');
			should.notEqual(Common.typeOf(function () {}), 'number');
			should.notEqual(Common.typeOf(function fun () {}), 'number');
			should.notEqual(Common.typeOf({}), 'number');
			should.notEqual(Common.typeOf(new Date()), 'number');
		});

		it("should only return 'function' with functions", function(){
			should.equal(Common.typeOf(function () {}), 'function');
			should.equal(Common.typeOf(function fun () {}), 'function');

			should.notEqual(Common.typeOf(null), 'function');
			should.notEqual(Common.typeOf(undefined), 'function');
			should.notEqual(Common.typeOf(1), 'function');
			should.notEqual(Common.typeOf(-1), 'function');
			should.notEqual(Common.typeOf(NaN), 'function');
			should.notEqual(Common.typeOf(Infinity), 'function');
			should.notEqual(Common.typeOf(-Infinity), 'function');
			should.notEqual(Common.typeOf("text"), 'function');
			should.notEqual(Common.typeOf([]), 'function');
			should.notEqual(Common.typeOf(true), 'function');
			should.notEqual(Common.typeOf(false), 'function');
			should.notEqual(Common.typeOf({}), 'function');
			should.notEqual(Common.typeOf(new Date()), 'function');
		});

		it("should only return 'object' with literal adn custom objects", function(){
			function CustomObject() {}

			var customObj = new CustomObject();

			should.equal(Common.typeOf({}), 'object');
			should.equal(Common.typeOf(customObj), 'object');

			should.notEqual(Common.typeOf(null), 'object');
			should.notEqual(Common.typeOf(undefined), 'object');
			should.notEqual(Common.typeOf(1), 'object');
			should.notEqual(Common.typeOf(-1), 'object');
			should.notEqual(Common.typeOf(NaN), 'object');
			should.notEqual(Common.typeOf(Infinity), 'object');
			should.notEqual(Common.typeOf(-Infinity), 'object');
			should.notEqual(Common.typeOf("text"), 'object');
			should.notEqual(Common.typeOf([]), 'object');
			should.notEqual(Common.typeOf(true), 'object');
			should.notEqual(Common.typeOf(false), 'object');
			should.notEqual(Common.typeOf(function () {}), 'object');
			should.notEqual(Common.typeOf(function fun () {}), 'object');
			should.notEqual(Common.typeOf(new Date()), 'object');
		});

		it("should only return 'dom' for dom objects");
	});

	describe('#inherits', function(){
		function BaseClass () {
			var privateProp = 'private';

			this.getPrivateProp = function ()
			{
				return privateProp;
			};

			this.setPrivateProp = function (value)
			{
				privateProp = value;
			};
		}

		function InheritedClass () {
			this.base(); // Call base constructor
		}

		Common.inherits(InheritedClass, BaseClass);

		var inhertied = new InheritedClass();

		it('should copy public properties', function(){
			should.equal(Common.typeOf(inhertied.getPrivateProp), 'function');
		});

		it('should keep private properties state', function(){
			should.equal(inhertied.getPrivateProp(), 'private');

			inhertied.setPrivateProp('new value');

			should.equal(inhertied.getPrivateProp(), 'new value');
		});
	});

	describe('#clone', function(){
		it('should create and exact copy of an object');
	});

	describe('#namespace', function(){
		it('should create a namespace if not exists');
		it('should create a hierarquical namespace if not exists');
		it('should not overwrite existant namespaces');
	});
});