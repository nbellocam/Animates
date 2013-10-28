/*global require, describe, it */

'use strict';

var Rectangle = require('../../../src/shapes/rectangle'),
	should = require("should");

describe('Rectangle', function(){
	describe('Constructor', function(){
		it('Should set default properties', function(){
			var rectangle = new Rectangle(),
				properties = rectangle.getProperties();

			properties.should.have.property('height', 100);
			properties.should.have.property('width', 100);
		});
	});
});