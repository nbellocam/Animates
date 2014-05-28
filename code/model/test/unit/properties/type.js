/*global describe, it */

'use strict';

var Type = require('../../../src/properties/type'),
	should = require("should");

describe('Type', function() {
	describe('isValid' , function () {
		it('Should return that the value is valid', function () {
			var options = 
					{
						'name' : 'test',
						'constraints' : [ function (value) { return value === 'test'; } ]
					},
				type = new Type(options);

			type.isValid('test').should.be.ok;
		});

		it('Should return that the value is not valid', function () {
			var options = 
					{
						'name' : 'test',
						'constraints' : [ function (value) { return value === 'test'; } ]
					},
				type = new Type(options);

			type.isValid('testFail').should.not.be.ok;
		});

		it('Should return use parent constraints', function () {
			var parenOptions =  
					{
						'name' : 'test',
						'constraints' : [ function (value) { return value.indexOf('test') === 0; } ]
					},
				parentType = new Type(parenOptions),
				options = 
					{
						'name' : 'test.limited',
						'constraints' : [ function (value) { return value.length < 7; } ],
						'parentType' : parentType
					},
				type = new Type(options);

			type.isValid('testFail').should.not.be.ok;
			type.isValid('test').should.be.ok;
		});
	});
});