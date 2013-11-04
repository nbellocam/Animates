/*global describe, it */

'use strict';

var Rectangle = require('../../../src/shapes/rectangle'),
	should = require("should");

describe('Rectangle', function(){
	describe('Constructor', function(){
		it('Should generate a random guid', function(){
			var instance = new Rectangle(),
				instance2 = new Rectangle();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});
		
		it('Should set default properties', function(){
			var instance = new Rectangle(),
				properties = instance.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type','none');
			properties.border.should.have.property('color','black');

			properties.should.have.property('height', 100);
			properties.should.have.property('width', 100);
		});
	});
});