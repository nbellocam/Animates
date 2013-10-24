/*global require, describe, it */

var Path = require('../../../src/utils/path'),
	should = require("should");

describe('Path', function(){
	describe('StartPosition', function(){
		it('Should start at (0,0) if it not specified otherwise', function(){
			var path = new Path(),
				startPosition = path.startPosition;

			startPosition.should.have.property('x', 0);
			startPosition.should.have.property('y', 0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedPositionX = 42,
				specifiedPositionY = 84,
				path = new Path({ startPosition : { x: specifiedPositionX, y: specifiedPositionY } }),
				startPosition = path.startPosition;

			startPosition.should.have.property('x', specifiedPositionX);
			startPosition.should.have.property('y', specifiedPositionY);
		});
	});

	describe('EndPosition', function(){
		it('Should end at (0,0) if it not specified otherwise', function(){
			var path = new Path(),
				endPosition = path.endPosition;

			endPosition.should.have.property('x', 0);
			endPosition.should.have.property('y', 0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedPositionX = 42,
				specifiedPositionY = 84,
				path = new Path({ endPosition : { x: specifiedPositionX, y: specifiedPositionY } }),
				endPosition = path.endPosition;

			endPosition.should.have.property('x', specifiedPositionX);
			endPosition.should.have.property('y', specifiedPositionY);
		});
	});

	describe('#getPositionFor()', function(){
		it('Should return an object with no x and y properties if currentFrame is less than startFrame', function(){
			var startFrame = 12,
				endFrame = 100,
				currentFrame = 1,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY };
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY };
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startFrame, endFrame, currentFrame);

			endPosition.should.not.have.properties('x', 'y');
		});

		it('Should return a copy of the endPosition if currentFrame is greater than endFrame.', function(){
			var startFrame = 12,
				endFrame = 100,
				currentFrame = 200,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY };
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY };
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startFrame, endFrame, currentFrame);

			should.notStrictEqual(endPosition, specifiedEndPosition);
			endPosition.should.have.property('x', specifiedEndPositionX);
			endPosition.should.have.property('y', specifiedEndPositionY);
		});

		it('Should return a copy of the startPosition if currentFrame is exactly the startFrame.', function(){
			var startFrame = 12,
				endFrame = 100,
				currentFrame = startFrame,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY };
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY };
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startFrame, endFrame, currentFrame);

			should.notStrictEqual(endPosition, specifiedStartPosition);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedStartPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedStartPositionY, 0.1);
		});

		it('Should return a copy of the endPosition if currentFrame is exactly the endFrame.', function(){
			var startFrame = 12,
				endFrame = 100,
				currentFrame = endFrame,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY };
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY };
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startFrame, endFrame, currentFrame);

			should.notStrictEqual(endPosition, specifiedEndPosition);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedEndPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedEndPositionY, 0.1);
		});

		it('Should calculate the correct value in an horizotal move with positive end position.');

		it('Should calculate the correct value in an vertical move with positive end position.');

		it('Should calculate the correct value in an diagonal move with positive end position.');

		it('Should calculate the correct value in an horizotal move with negative end position.');

		it('Should calculate the correct value in an vertical move with negative end position.');

		it('Should calculate the correct value in an diagonal move with negative end position.');
	});
});
