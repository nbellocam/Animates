/*global require, describe, it */

var Animation = require('../../src/animation'),
	assert = require("assert");

describe('Animation', function(){
	describe('StartFrame', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var animation = new Animation(),
				startFrame = animation.startFrame;

			startFrame.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedInitialFrame = 42,
				animation = new Animation({ startFrame : specifiedInitialFrame }),
				startFrame = animation.startFrame;

			startFrame.should.be.exactly(specifiedInitialFrame);
		});
	});

	describe('EndFrame', function(){
		it('Should end at -1 if it not specified otherwise', function(){
			var animation = new Animation(),
				endFrame = animation.endFrame;

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function(){
			var specifiedInitialFrame = 42,
				animation = new Animation({ endFrame : specifiedInitialFrame }),
				endFrame = animation.endFrame;

			endFrame.should.be.exactly(specifiedInitialFrame);
		});
	});

	describe('#getPropertiesForFrame()', function(){
		//TODO
		it('Should create a copy of the original frame.');

		it('Should update the properties of the copy of the original frame, based on the frame.');

		it('Should retrive a copy of the original frame with no changes if the frame is before the initialFrame');

		it('Should retrive a copy of the end frame with no extra changes if the frame is after the endFrame');
	});
});
