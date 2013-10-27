/*global describe, it */

'use strict';

var MoveEffect = require('../../../src/effects/moveEffect'),
	should = require("should");

describe('MoveEffect', function(){
	describe('StartFrame', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var effect = new MoveEffect(),
				startFrame = effect.startFrame;

			startFrame.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedInitialFrame = 42,
				effect = new MoveEffect({ startFrame : specifiedInitialFrame }),
				startFrame = effect.startFrame;

			startFrame.should.be.exactly(specifiedInitialFrame);
		});
	});

	describe('EndFrame', function(){
		it('Should end at -1 if it not specified otherwise', function(){
			var effect = new MoveEffect(),
				endFrame = effect.endFrame;

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor', function(){
			var specifiedInitialFrame = 42,
				effect = new MoveEffect({ endFrame : specifiedInitialFrame }),
				endFrame = effect.endFrame;

			endFrame.should.be.exactly(specifiedInitialFrame);
		});
	});

	describe('#getPropertiesForFrame()', function(){
		it('Should return the original frame not adding the x and y properties if path was not passed.', function(){
			var specifiedFrame = 42,
				beginShapeFrame = {},
				effect = new MoveEffect(),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
			endShapeFrame.should.not.have.properties('x', 'y');
		});

		it('Should return the original frame not updating the x and y properties if path was not passed.', function(){
			var specifiedFrame = 42,
				specifiedX = 24,
				specifiedY = 32,
				beginShapeFrame = { x:specifiedX, y:specifiedY },
				effect = new MoveEffect(),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
			endShapeFrame.should.have.property('x', specifiedX);
			endShapeFrame.should.have.property('y', specifiedY);
		});

		it('Should return the original frame not adding the x and y properties if path was passed without the getPositionFor function.', function(){
			var specifiedFrame = 42,
				beginShapeFrame = {},
				specifiedPath = {},
				effect = new MoveEffect({ path: specifiedPath }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
			endShapeFrame.should.not.have.properties('x', 'y');
		});

		it('Should return the original frame not updating the x and y properties if path was passed without the getPositionFor function.', function(){
			var specifiedFrame = 42,
				specifiedX = 24,
				specifiedY = 32,
				beginShapeFrame = { x:specifiedX, y:specifiedY },
				specifiedPath = {},
				effect = new MoveEffect({ path: specifiedPath }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			endShapeFrame.should.have.property('x', specifiedX);
			endShapeFrame.should.have.property('y', specifiedY);
		});

		it('Should return the original frame with the new values.', function(){
			var specifiedFrame = 42,
				specifiedX = 24,
				specifiedY = 32,
				beginShapeFrame = { x:specifiedX, y:specifiedY },
				resultX = specifiedX * 2,
				resultY = specifiedY * 2,
				specifiedPath = { getPositionFor: function(startFrame, endFrame, currentFrame) { return { x:resultX, y:resultY }; } },
				effect = new MoveEffect({ path: specifiedPath }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
			endShapeFrame.should.have.property('x', resultX);
			endShapeFrame.should.have.property('y', resultY);
		});

		it('Should retrive a copy of the original frame with no changes if the frame is before the initialFrame', function(){
			var specifiedFrame = 42,
				specifiedInitialFrame = 100,
				specifiedX = 24,
				specifiedY = 32,
				beginShapeFrame = { x:specifiedX, y:specifiedY },
				resultX = specifiedX * 2,
				resultY = specifiedY * 2,
				specifiedPath = { getPositionFor: function(startFrame, endFrame, currentFrame) { return { x:resultX, y:resultY }; } },
				effect = new MoveEffect({ startFrame : specifiedInitialFrame, path: specifiedPath }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
			endShapeFrame.should.have.property('x', specifiedX);
			endShapeFrame.should.have.property('y', specifiedY);
		});

		it('Should retrive a copy of the end frame with no extra changes if the frame is after the endFrame', function(){
			var specifiedFrame = 42,
				specifiedEndFrame = 40,
				specifiedX = 24,
				specifiedY = 32,
				beginShapeFrame = { x:specifiedX, y:specifiedY },
				specifiedPath = { getPositionFor: function(startFrame, endFrame, currentFrame) { return { x:(specifiedX*currentFrame), y:(specifiedY*currentFrame) }; } },
				effect = new MoveEffect({ endFrame : specifiedEndFrame, path: specifiedPath }),
				endShapeFrame = effect.getPropertiesForFrame(specifiedFrame, beginShapeFrame);

			should.strictEqual(endShapeFrame, beginShapeFrame);
			endShapeFrame.should.have.property('x', specifiedX*specifiedEndFrame);
			endShapeFrame.should.have.property('y', specifiedY*specifiedEndFrame);
		});
	});
});
