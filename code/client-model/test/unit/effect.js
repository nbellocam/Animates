/*global require, describe, it */

var Effect = require('../../src/effect'),
	should = require("should");

describe('Effect', function(){
	describe('StartFrame', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var effect = new Effect(),
				startFrame = effect.startFrame;

			startFrame.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedInitialFrame = 42,
				effect = new Effect({ startFrame : specifiedInitialFrame }),
				startFrame = effect.startFrame;

			startFrame.should.be.exactly(specifiedInitialFrame);
		});
	});

	describe('EndFrame', function(){
		it('Should end at -1 if it not specified otherwise', function(){
			var effect = new Effect(),
				endFrame = effect.endFrame;

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function(){
			var specifiedEndFrame = 42,
				effect = new Effect({ endFrame : specifiedEndFrame }),
				endFrame = effect.endFrame;

			endFrame.should.be.exactly(specifiedEndFrame);
		});
	});

	describe('#getPropertiesForFrame()', function(){
		it('Should return the original frame.', function(){
			var specifiedFrame = 42,
				beginShapeFrame = {},
				effect = new Effect(),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
		});

		it('Should return the original frame even with the frame after the end frame.', function(){
			var specifiedEndFrame = 42,
				specifiedFrame = 100,
				beginShapeFrame = {},
				effect = new Effect({ endFrame : specifiedEndFrame }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
		});

		it('Should return the original frame specially with the frame before the start frame.', function(){
			var specifiedInitialFrame = 100,
				specifiedFrame = 42,
				beginShapeFrame = {},
				effect = new Effect({ startFrame : specifiedInitialFrame }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
		});
	});
});
