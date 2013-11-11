/*global describe, it */

'use strict';

var MediaFrame = require('../../src/mediaFrame'),
	should = require("should");

describe('MediaFrame', function(){
	describe('Constructor', function(){
		it('Should use default properties', function(){
			var mediaFrame = new MediaFrame(),
				defaultProperties = mediaFrame.properties();
			defaultProperties.currentFrame.should.be.exactly(-1);
			defaultProperties.mediaObject.should.be.empty;
		});	

		it('Should use constructor properties', function(){
			var someProperties = {
					h : 100,
					w : 200,
					l : 10
				},
				mediaFrame = new MediaFrame(someProperties),
				defaultProperties = mediaFrame.properties();

			defaultProperties.h.should.be.exactly(100);
			defaultProperties.w.should.be.exactly(200);
			defaultProperties.l.should.be.exactly(10);
		});	
	});

	describe('#properties', function(){
		it('Should override passed properties leaving the missing ones untouched', function(){
			var someProperties = {
					h : 100,
					w : 200,
					l : 10
				},
				mediaFrame = new MediaFrame(someProperties),
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