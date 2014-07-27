/*global require, describe, it */
/*jshint expr: true */


var Common = require('../src/common'),
	assert = require("assert"),
	should = require("should");

describe('Common', function() {
	describe('#createShortGuid', function() {
		it('should match the guid regex', function() {
			var guid = Common.createGuid();

			guid.should.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
		});
	});
	describe('realTypeOf', function() {
		it('Should return String strings', function() {
			Common.realTypeOf('text').should.equal('String');
		});

		it('Should return Object for {}', function() {
			Common.realTypeOf({}).should.equal('Object');
		});

		it('Should return Number for numbers', function() {
			Common.realTypeOf(1).should.equal('Number');
		});

		it('Should return Boolean for true or false', function() {
			Common.realTypeOf(true).should.equal('Boolean');
			Common.realTypeOf(false).should.equal('Boolean');
		});

		it('Should return Custom types', function() {
			var obj;
			function Custom() {}
			obj = new Custom();
			Common.realTypeOf(obj).should.equal('Custom');
		});

		it('Should return Custom types', function() {
			var obj;
			function Custom() {}
			var b = Custom;
			obj = new b();
			Common.realTypeOf(obj).should.equal('Custom');
		});
	});

	describe('#typeOf', function() {
		it('should only return null with null or undefined objects', function() {
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

		it("should only return 'string' with string literals", function() {
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

		it("should only return 'boolean' with boolean literals", function() {
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

		it("should only return 'date' with date objects", function() {
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

		it("should only return 'array' with array objects", function() {
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

		it("should only return 'number' with number and NaN objects", function() {
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

		it("should only return 'function' with functions", function() {
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

		it("should only return 'object' with literal adn custom objects", function() {
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

	describe('#inherits', function() {
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

		it('should copy public properties', function() {
			should.equal(Common.typeOf(inhertied.getPrivateProp), 'function');
		});

		it('should keep private properties state', function() {
			should.equal(inhertied.getPrivateProp(), 'private');

			inhertied.setPrivateProp('new value');

			should.equal(inhertied.getPrivateProp(), 'new value');
		});
	});

	describe('#inheritsWithOverride', function() {
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

			this.testFunction = function (value)
			{
				return "base";
			};
		}

		function InheritedClass () {
			this.base(); // Call base constructor

			this.testFunction = function (value)
			{
				return "inherited";
			};
		}

		Common.inherits(InheritedClass, BaseClass);

		var base = new BaseClass();
		var inhertied = new InheritedClass();

		it('should copy public properties', function() {
			should.equal(Common.typeOf(inhertied.getPrivateProp), 'function');
		});

		it('should keep private properties state', function() {
			should.equal(inhertied.getPrivateProp(), 'private');

			inhertied.setPrivateProp('new value');

			should.equal(inhertied.getPrivateProp(), 'new value');
		});

		it('should use the base testFunction function', function() {
			should.equal(Common.typeOf(base.testFunction), 'function');

			should.equal(base.testFunction(), 'base');
		});

		it('should use the new testFunction function', function() {
			should.equal(Common.typeOf(inhertied.testFunction), 'function');

			should.equal(inhertied.testFunction(), 'inherited');
		});
	});

	describe('#clone', function() {
		it('should create and exact copy of an object');
	});

	describe('#extend', function() {
		it('should not overwrite existing values', function () {
			var options = {
					prop : 'value',
					prop2 : 'otherValue'
				},
				defaults = {
					prop : 'defaultProp',
					prop2 : 'defaultProp2'
				},
				extension;

			extension = Common.extend(options, defaults);

			extension.should.have.property('prop', 'value');
			extension.should.have.property('prop2', 'otherValue');
			extension.should.be.exactly(options);
		});

		it('should set default values to missing properties', function () {
			var options = {
					prop : 'value'
				},
				defaults = {
					prop : 'defaultProp',
					prop2 : 'defaultProp2'
				},
				extension;

			extension = Common.extend(options, defaults);

			extension.should.have.property('prop', 'value');
			extension.should.have.property('prop2', 'defaultProp2');
			extension.should.be.exactly(options);
		});

		it('should work in depth and not overwrite partially defined sub-objects', function () {
			var options = {
					prop : 'value',
					prop2 : {
						att : 'att1'
					}
				},
				defaults = {
					prop : 'defaultProp',
					prop2 : {
						att : 'defaultAtt1',
						att2 : 'defaultAtt2'
					}
				},
				extension;

			extension = Common.extend(options, defaults);

			extension.should.have.property('prop', 'value');
			extension.should.have.property('prop2');
			extension.prop2.should.have.property('att', 'att1');
			extension.prop2.should.have.property('att2', 'defaultAtt2');
			extension.should.be.exactly(options);
		});
	});

	describe('#namespace', function() {
		it('should create a namespace if not exists');
		it('should create a hierarquical namespace if not exists');
		it('should not overwrite existant namespaces');
	});

	describe('#getKeysFromObject', function() {
		it('should return empty list if object is empty', function() {
			var object = {},
				result = Common.getKeysFromObject(object);
			result.should.be.an.Array.and.an.length(0);
		});

		it('should return a list with one element if object has one property', function() {
			var keyName = 'key',
				object = { 'key' : 'value'},
				result = Common.getKeysFromObject(object);

			result.should.be.an.Array.and.an.length(1);
			result.should.containEql(keyName);
		});

		it('should return a list with two element if object has two property', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				object = { 'keyName1' : 'value',  'keyName2' : 'value2' },
				result = Common.getKeysFromObject(object);

			result.should.be.an.Array.and.an.length(2);
			result.should.containEql(keyName1);
			result.should.containEql(keyName2);
		});
	});

	describe('#filterArray', function() {
		it('should return a new list with the same values if no filter was applied', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				filter = [],
				list = [keyName1, keyName2],
				result = Common.filterArray(list, filter);

			result.should.be.an.Array.and.an.length(2);
			result.should.not.equal(list);
			result.should.containEql(keyName1);
			result.should.containEql(keyName2);
		});

		it('should return a new list with one less value if one filter was applied', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				filter = [keyName1],
				list = [keyName1, keyName2],
				result = Common.filterArray(list, filter);

			result.should.be.an.Array.and.an.length(1);
			result.should.not.equal(list);
			result.should.containEql(keyName2);
		});

		it('should return a new list with two less value if two filter was applied', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName3],
				list = [keyName1, keyName2, keyName3],
				result = Common.filterArray(list, filter);

			result.should.be.an.Array.and.an.length(1);
			result.should.not.equal(list);
			result.should.containEql(keyName2);
		});

		it('should return a new list with one less value if two filter was applied but one was not present', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName3],
				list = [keyName1, keyName2],
				result = Common.filterArray(list, filter);

			result.should.be.an.Array.and.an.length(1);
			result.should.not.equal(list);
			result.should.containEql(keyName2);
		});

		it('should return a new empty list if all elements in the filter match', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName2, keyName3],
				list = [keyName1, keyName2, keyName3],
				result = Common.filterArray(list, filter);

			result.should.be.an.Array.and.an.length(0);
			result.should.not.equal(list);
		});
	});

	describe('#filterObject', function() {
		it('should return a new object with the same key/values if no filter was applied', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				filter = [],
				object = {
					keyName1 : 42,
					keyName2 : 42
				},
				result = Common.filterObject(object, filter);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.have.properties(keyName1, keyName2);
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return a new object with one less key/values if one filter was applied', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				filter = [keyName1],
				object = {
					keyName1 : 42,
					keyName2 : 42
				},
				result = Common.filterObject(object, filter);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.not.have.property(keyName1);
			result.should.have.property(keyName2);
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return a new object with two less key/values if two filter was applied', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName3],
				object = {
					keyName1 : 42,
					keyName2 : 42,
					keyName3 : 42
				},
				result = Common.filterObject(object, filter);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.not.have.property(keyName1);
			result.should.have.property(keyName2);
			result.should.not.have.property(keyName3);
			object.should.have.properties(keyName1, keyName2, keyName3);
		});

		it('should return a new object with one less key/values if two filter was applied but one was not present', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName3],
				object = {
					keyName1 : 42,
					keyName2 : 42,
				},
				result = Common.filterObject(object, filter);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.not.have.property(keyName1);
			result.should.have.property(keyName2);
			result.should.not.have.property(keyName3);
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return a new empty object if all elements in the filter match', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName2, keyName3],
				object = {
					keyName1 : 42,
					keyName2 : 42,
					keyName3 : 42
				},
				result = Common.filterObject(object, filter);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.not.have.property(keyName1);
			result.should.not.have.property(keyName2);
			result.should.not.have.property(keyName3);
			object.should.have.properties(keyName1, keyName2, keyName3);
		});

		it('should return a new object with no elements if no filter was applied with included option', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				filter = [],
				object = {
					keyName1 : 42,
					keyName2 : 42
				},
				result = Common.filterObject(object, filter, true);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.not.have.properties(keyName1, keyName2);
			result.should.be.empty;
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return a new object with one key/values if one filter was applied (with included option)', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				filter = [keyName1],
				object = {
					keyName1 : 42,
					keyName2 : 42
				},
				result = Common.filterObject(object, filter, true);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.have.property(keyName1);
			result.should.not.have.property(keyName2);
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return a new object with one key/values if one filter was applied (with included option and three elements)', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName2],
				object = {
					keyName1 : 42,
					keyName2 : 42,
					keyName3 : 42
				},
				result = Common.filterObject(object, filter, true);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.not.have.property(keyName1);
			result.should.have.property(keyName2);
			result.should.not.have.property(keyName3);
			object.should.have.properties(keyName1, keyName2, keyName3);
		});

		it('should return a new object with two key/values if two filter was applied (with included option)', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName3],
				object = {
					keyName1 : 42,
					keyName2 : 42,
					keyName3 : 42
				},
				result = Common.filterObject(object, filter, true);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.have.property(keyName1);
			result.should.not.have.property(keyName2);
			result.should.have.property(keyName3);
			object.should.have.properties(keyName1, keyName2, keyName3);
		});

		it('should return a new object with one key/values if two filter was applied but one was not present (with included option)', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName3],
				object = {
					keyName1 : 42,
					keyName2 : 42,
				},
				result = Common.filterObject(object, filter, true);


			result.should.not.be.an.Array.and.be.an.Object;
			result.should.have.have.property(keyName1);
			result.should.not.property(keyName2);
			result.should.not.have.property(keyName3);
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return a new object with all the elements if all elements in the filter match (with included option)', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				keyName3 = 'keyName3',
				filter = [keyName1, keyName2, keyName3],
				object = {
					keyName1 : 42,
					keyName2 : 42,
					keyName3 : 42
				},
				result = Common.filterObject(object, filter, true);

			result.should.not.be.an.Array.and.be.an.Object;
			result.should.have.properties(keyName1, keyName2, keyName3);
			object.should.have.properties(keyName1, keyName2, keyName3);
		});
	});

	describe('#isEmpty', function() {
		it('should return true if an empty object is passed by param', function() {
			var object = { },
				result = Common.isEmpty(object);

			result.should.be.an.Boolean.and.be.true;
			object.should.be.empty;
		});

		it('should return false if a not empty object is passed by param', function() {
			var keyName1 = 'keyName1',
				keyName2 = 'keyName2',
				object = {
					keyName1 : 42,
					keyName2 : 42
				},
				result = Common.isEmpty(object);

			result.should.be.an.Boolean.and.be.false;
			object.should.have.properties(keyName1, keyName2);
		});

		it('should return false if a not empty object is passed by param (only functions)', function() {
			var keyName1 = 'keyName1',
				object = {
					keyName1 : function (param){}
				},
				result = Common.isEmpty(object);

			result.should.be.an.Boolean.and.be.false;
			object.should.have.properties(keyName1);
		});
	});
});
