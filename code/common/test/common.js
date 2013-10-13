/*global require, describe, it */

var Common = require('../src/common'),
	assert = require("assert");

describe('Common', function(){
	describe('#createShortGuid', function(){
		it('should match the guid regex', function(){
			var guid = Common.createGuid();

			assert.equal(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(guid), true);
		});
	});

	describe('#typeOf', function(){
		it('should only return null with null or undefined objects', function(){
			assert.strictEqual(Common.typeOf(null), null);
			assert.strictEqual(Common.typeOf(undefined), null);

			assert.notEqual(Common.typeOf(1), null);
			assert.notEqual(Common.typeOf(-1), null);
			assert.notEqual(Common.typeOf(NaN), null);
			assert.notEqual(Common.typeOf(Infinity), null);
			assert.notEqual(Common.typeOf(-Infinity), null);
			assert.notEqual(Common.typeOf("text"), null);
			assert.notEqual(Common.typeOf([]), null);
			assert.notEqual(Common.typeOf(true), null);
			assert.notEqual(Common.typeOf(false), null);
			assert.notEqual(Common.typeOf(function () {}), null);
			assert.notEqual(Common.typeOf(function fun () {}), null);
			assert.notEqual(Common.typeOf({}), null);
			assert.notEqual(Common.typeOf(new Date()), null);
		});

		it("should only return 'string' with string literals", function(){
			assert.strictEqual(Common.typeOf("text"), 'string');

			assert.notEqual(Common.typeOf(null), 'string');
			assert.notEqual(Common.typeOf(undefined), 'string');
			assert.notEqual(Common.typeOf(1), 'string');
			assert.notEqual(Common.typeOf(-1), 'string');
			assert.notEqual(Common.typeOf(NaN), 'string');
			assert.notEqual(Common.typeOf(Infinity), 'string');
			assert.notEqual(Common.typeOf(-Infinity), 'string');
			assert.notEqual(Common.typeOf([]), 'string');
			assert.notEqual(Common.typeOf(true), 'string');
			assert.notEqual(Common.typeOf(false), 'string');
			assert.notEqual(Common.typeOf(function () {}), 'string');
			assert.notEqual(Common.typeOf(function fun () {}), 'string');
			assert.notEqual(Common.typeOf({}), 'string');
			assert.notEqual(Common.typeOf(new Date()), 'string');
		});

		it("should only return 'boolean' with boolean literals", function(){
			assert.strictEqual(Common.typeOf(true), 'boolean');
			assert.strictEqual(Common.typeOf(false), 'boolean');

			assert.notEqual(Common.typeOf(null), 'boolean');
			assert.notEqual(Common.typeOf(undefined), 'boolean');
			assert.notEqual(Common.typeOf(1), 'boolean');
			assert.notEqual(Common.typeOf(-1), 'boolean');
			assert.notEqual(Common.typeOf(NaN), 'boolean');
			assert.notEqual(Common.typeOf(Infinity), 'boolean');
			assert.notEqual(Common.typeOf(-Infinity), 'boolean');
			assert.notEqual(Common.typeOf("text"), 'boolean');
			assert.notEqual(Common.typeOf([]), 'boolean');
			assert.notEqual(Common.typeOf(function () {}), 'boolean');
			assert.notEqual(Common.typeOf(function fun () {}), 'boolean');
			assert.notEqual(Common.typeOf({}), 'boolean');
			assert.notEqual(Common.typeOf(new Date()), 'boolean');
		});

		it("should only return 'date' with date objects", function(){
			assert.strictEqual(Common.typeOf(new Date()), 'date');

			assert.notEqual(Common.typeOf(null), 'date');
			assert.notEqual(Common.typeOf(undefined), 'date');
			assert.notEqual(Common.typeOf(1), 'date');
			assert.notEqual(Common.typeOf(-1), 'date');
			assert.notEqual(Common.typeOf(NaN), 'date');
			assert.notEqual(Common.typeOf(Infinity), 'date');
			assert.notEqual(Common.typeOf(-Infinity), 'date');
			assert.notEqual(Common.typeOf("text"), 'date');
			assert.notEqual(Common.typeOf([]), 'date');
			assert.notEqual(Common.typeOf(true), 'date');
			assert.notEqual(Common.typeOf(false), 'date');
			assert.notEqual(Common.typeOf(function () {}), 'date');
			assert.notEqual(Common.typeOf(function fun () {}), 'date');
			assert.notEqual(Common.typeOf({}), 'date');
		});

		it("should only return 'array' with array objects", function(){
			assert.strictEqual(Common.typeOf([]), 'array');

			assert.notEqual(Common.typeOf(null), 'array');
			assert.notEqual(Common.typeOf(undefined), 'array');
			assert.notEqual(Common.typeOf(1), 'array');
			assert.notEqual(Common.typeOf(-1), 'array');
			assert.notEqual(Common.typeOf(NaN), 'array');
			assert.notEqual(Common.typeOf(Infinity), 'array');
			assert.notEqual(Common.typeOf(-Infinity), 'array');
			assert.notEqual(Common.typeOf("text"), 'array');
			assert.notEqual(Common.typeOf(true), 'array');
			assert.notEqual(Common.typeOf(false), 'array');
			assert.notEqual(Common.typeOf(function () {}), 'array');
			assert.notEqual(Common.typeOf(function fun () {}), 'array');
			assert.notEqual(Common.typeOf({}), 'array');
			assert.notEqual(Common.typeOf(new Date()), 'array');
		});

		it("should only return 'number' with number and NaN objects", function(){
			assert.strictEqual(Common.typeOf(1), 'number');
			assert.strictEqual(Common.typeOf(-1), 'number');
			assert.strictEqual(Common.typeOf(NaN), 'number');
			assert.strictEqual(Common.typeOf(Infinity), 'number');
			assert.strictEqual(Common.typeOf(-Infinity), 'number');


			assert.notEqual(Common.typeOf(null), 'number');
			assert.notEqual(Common.typeOf(undefined), 'number');
			assert.notEqual(Common.typeOf("text"), 'number');
			assert.notEqual(Common.typeOf([]), 'number');
			assert.notEqual(Common.typeOf(true), 'number');
			assert.notEqual(Common.typeOf(false), 'number');
			assert.notEqual(Common.typeOf(function () {}), 'number');
			assert.notEqual(Common.typeOf(function fun () {}), 'number');
			assert.notEqual(Common.typeOf({}), 'number');
			assert.notEqual(Common.typeOf(new Date()), 'number');
		});

		it("should only return 'function' with functions", function(){
			assert.strictEqual(Common.typeOf(function () {}), 'function');
			assert.strictEqual(Common.typeOf(function fun () {}), 'function');

			assert.notEqual(Common.typeOf(null), 'function');
			assert.notEqual(Common.typeOf(undefined), 'function');
			assert.notEqual(Common.typeOf(1), 'function');
			assert.notEqual(Common.typeOf(-1), 'function');
			assert.notEqual(Common.typeOf(NaN), 'function');
			assert.notEqual(Common.typeOf(Infinity), 'function');
			assert.notEqual(Common.typeOf(-Infinity), 'function');
			assert.notEqual(Common.typeOf("text"), 'function');
			assert.notEqual(Common.typeOf([]), 'function');
			assert.notEqual(Common.typeOf(true), 'function');
			assert.notEqual(Common.typeOf(false), 'function');
			assert.notEqual(Common.typeOf({}), 'function');
			assert.notEqual(Common.typeOf(new Date()), 'function');
		});

		it("should only return 'object' with literal adn custom objects", function(){
			function CustomObject() {}

			var customObj = new CustomObject();

			assert.strictEqual(Common.typeOf({}), 'object');
			assert.strictEqual(Common.typeOf(customObj), 'object');

			assert.notEqual(Common.typeOf(null), 'object');
			assert.notEqual(Common.typeOf(undefined), 'object');
			assert.notEqual(Common.typeOf(1), 'object');
			assert.notEqual(Common.typeOf(-1), 'object');
			assert.notEqual(Common.typeOf(NaN), 'object');
			assert.notEqual(Common.typeOf(Infinity), 'object');
			assert.notEqual(Common.typeOf(-Infinity), 'object');
			assert.notEqual(Common.typeOf("text"), 'object');
			assert.notEqual(Common.typeOf([]), 'object');
			assert.notEqual(Common.typeOf(true), 'object');
			assert.notEqual(Common.typeOf(false), 'object');
			assert.notEqual(Common.typeOf(function () {}), 'object');
			assert.notEqual(Common.typeOf(function fun () {}), 'object');
			assert.notEqual(Common.typeOf(new Date()), 'object');
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
			assert.strictEqual(Common.typeOf(inhertied.getPrivateProp), 'function');
		});

		it('should keep private properties state', function(){
			assert.strictEqual(inhertied.getPrivateProp(), 'private');

			inhertied.setPrivateProp('new value');

			assert.strictEqual(inhertied.getPrivateProp(), 'new value');
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