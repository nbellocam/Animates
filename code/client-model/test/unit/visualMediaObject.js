/*global require, describe, it */

'use strict';

var VisualMediaObject = require('../../src/visualMediaObject'),
	should = require("should");

describe('VisualMediaObject', function(){
	describe('Constructor', function(){
		it('Should set default properties', function(){
			var visualMediaObject = new VisualMediaObject(),
				properties = visualMediaObject.getProperties();

			properties.should.have.property('position');
			properties.should.have.property('border');
			properties.should.have.property('position');
		});
	});
});