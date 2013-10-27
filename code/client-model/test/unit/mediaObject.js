/*global require, describe, it */

'use strict';

var MediaObject = require('../../src/mediaObject'),
	should = require("should");

describe('MediaObject', function(){
	describe('Constructor', function(){
		it('Should generate a random guid', function(){
			var mediaObject = new MediaObject(),
				mediaObject2 = new MediaObject();

			mediaObject.getGuid().should.have.type('string');
			mediaObject.getGuid().should.not.be.equal(mediaObject2.getGuid());
		});
	});
});