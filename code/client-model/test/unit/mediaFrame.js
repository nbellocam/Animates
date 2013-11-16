/*global describe, it */

'use strict';

var MediaFrame = require('../../src/mediaFrame'),
	should = require("should");

describe('MediaFrame', function() {

	function MediaObjectMock () {
		this.getProperties = function properties () {
			return {
				h : 100,
				w : 200,
				l : 10
			};
		};
	}

	describe('constructor', function(){
		it('Should fail without mediaObject option.', function(){
			should(function () { new MediaFrame(); }).throw();
		});	

		it('Should use constructor properties', function(){
			var mediaObject = new MediaObjectMock(),
				mediaFrame = new MediaFrame({ mediaObject :  mediaObject}),
				currentProperties = mediaFrame.properties();

			currentProperties.h.should.be.exactly(100);
			currentProperties.w.should.be.exactly(200);
			currentProperties.l.should.be.exactly(10);
		});	
	});

	describe('properties()', function(){
		it('Should override passed properties leaving the missing ones untouched.', function(){
			var mediaObject = new MediaObjectMock(),
				mediaFrame = new MediaFrame({ mediaObject :  mediaObject}),
				currentProperties = mediaFrame.properties();

			currentProperties.h.should.be.exactly(100);
			currentProperties.w.should.be.exactly(200);
			currentProperties.l.should.be.exactly(10);

			mediaFrame.properties({ h : 255 });
			currentProperties = mediaFrame.properties();

			currentProperties.h.should.be.exactly(255);
			currentProperties.w.should.be.exactly(200);
			currentProperties.l.should.be.exactly(10);
		});	
	});
});
