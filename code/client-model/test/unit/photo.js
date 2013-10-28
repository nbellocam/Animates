/*global require, describe, it */

'use strict';

var Photo = require('../../src/photo'),
	should = require("should");

describe('Photo', function(){
	describe('Constructor', function(){
		it('Should set default properties', function(){
			var photo = new Photo(),
				properties = photo.getProperties();

			properties.should.have.property('source');
		});
	});
});