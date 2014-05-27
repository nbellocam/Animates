/*global describe, it */

'use strict';

var TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('TypesManager', function() {
	describe('registerType', function () {
		it('Should add new simple type', function () {
			TypesManager.registerType('test', []);

			should.exist(TypesManager.getType('test'));
		});

		it('Should add new type with inheritance', function () {
			var type;

			TypesManager.registerType('test', [ function (value) { return value.indexOf('test') === 0; } ]);
			TypesManager.registerType('testLimited', [ function (value) { return value.length < 7; }], 'test' );

			type = TypesManager.getType('test');
			
			should.exist(type);
			type.isValid('test').should.be.ok;
			type.isValid('testtttttttt').should.be.ok;

			type = TypesManager.getType('testLimited');
			type.isValid('test').should.be.ok;
			type.isValid('testtttttttt').should.not.be.ok;
		});
	});
});