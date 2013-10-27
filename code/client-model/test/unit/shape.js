/*global require, describe, it */

'use strict';

var Shape = require('../../src/shape'),
	should = require("should");

describe('Shape', function(){
	describe('Constructor', function(){
		it('Should generate a random guid', function(){
			var shape = new Shape(),
				shape2 = new Shape();

			shape.getGuid().should.have.type('string');
			shape.getGuid().should.not.be.equal(shape2.getGuid());
		});
	});
});