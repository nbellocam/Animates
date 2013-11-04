/*global describe, it */

'use strict';

var VisualMediaObject = require('../../src/visualMediaObject'),
	should = require("should");

describe('VisualMediaObject', function(){
	describe('Constructor', function(){
		it('Should generate a random guid', function(){
			var instance = new VisualMediaObject(),
				instance2 = new VisualMediaObject();

			instance.getGuid().should.have.type('string');
			instance.getGuid().should.not.be.equal(instance2.getGuid());
		});
		
		it('Should set default properties', function(){
			var visualMediaObject = new VisualMediaObject(),
				properties = visualMediaObject.getProperties();

			properties.should.have.property('position');
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type','none');
			properties.border.should.have.property('color','black');
		});
	});
});