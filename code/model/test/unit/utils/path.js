/*global describe, it */

'use strict';

var Path = require('../../../src/utils/path'),
	should = require("should");

describe('Path', function(){
	describe('startPosition', function(){
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

	describe('endPosition', function(){
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

	describe('getPositionFor()', function(){
		it('Should return an object with no x and y properties if currentTick is less than startTick', function(){
			var startTick = 12,
				endTick = 100,
				currentTick = 1,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, currentTick);

			endPosition.should.not.have.properties('x', 'y');
		});

		it('Should return a copy of the endPosition if currentTick is greater than endTick.', function(){
			var startTick = 12,
				endTick = 100,
				currentTick = 200,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, currentTick);

			should.notStrictEqual(endPosition, specifiedEndPosition);
			endPosition.should.have.property('x', specifiedEndPositionX);
			endPosition.should.have.property('y', specifiedEndPositionY);
		});

		it('Should return a copy of the startPosition if currentTick is exactly the startTick.', function(){
			var startTick = 12,
				endTick = 100,
				currentTick = startTick,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, currentTick);

			should.notStrictEqual(endPosition, specifiedStartPosition);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedStartPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedStartPositionY, 0.1);
		});

		it('Should return a copy of the startPosition if currentTick is exactly the startTick (with endTick == -1)', function(){
			var startTick = 12,
				endTick = -1,
				currentTick = startTick,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, currentTick);

			should.notStrictEqual(endPosition, specifiedStartPosition);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedStartPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedStartPositionY, 0.1);
		});

		it('Should return a copy of the endPosition if currentTick is exactly the endTick.', function(){
			var startTick = 12,
				endTick = 100,
				currentTick = endTick,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, currentTick);

			should.notStrictEqual(endPosition, specifiedEndPosition);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedEndPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedEndPositionY, 0.1);
		});

		it('Should calculate the correct value in an horizotal move with positive end position.', function(){
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 0,
				specifiedEndPositionX = 10,
				specifiedPositionY = 10,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an vertical move with positive end position.', function(){
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionY = 0,
				specifiedEndPositionY = 10,
				specifiedPositionX = 10,
				specifiedStartPosition = { x: specifiedPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(specifiedPositionX, 0.1);
				endPosition.y.should.be.approximately(i, 0.1);
			}
		});

		it('Should calculate the correct value in an diagonal move with positive end position.', function(){
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 0,
				specifiedEndPositionX = 10,
				specifiedStartPositionY = 0,
				specifiedEndPositionY = 10,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(i, 0.1);
				endPosition.y.should.be.approximately(i, 0.1);
			}
		});

		it('Should calculate the correct value in an horizotal move with negative end position.', function(){
			var startTick = 0,
				endTick = 10,
				specifiedPositionX = 0,
				specifiedStartPositionY = 10,
				specifiedEndPositionY = 0,
				specifiedStartPosition = { x: specifiedPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(specifiedPositionX, 0.1);
				endPosition.y.should.be.approximately(10 - i, 0.1);
			}
		});

		it('Should calculate the correct value in an vertical move with negative end position.', function(){
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedPositionY = 0,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an diagonal move with negative end position.', function(){
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedStartPositionY = 10,
				specifiedEndPositionY = 0,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(10 - i, 0.1);
			}
		});

		it('Should calculate the correct value in an horizotal move with positive end position (with endTick == -1).', function(){
			var startTick = 0,
				endTick = -1,
				specifiedStartPositionX = 0,
				specifiedEndPositionX = 10,
				specifiedPositionY = 10,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an vertical move with positive end position (with endTick == -1).', function(){
			var startTick = 0,
				endTick = -1,
				specifiedStartPositionY = 0,
				specifiedEndPositionY = 10,
				specifiedPositionX = 10,
				specifiedStartPosition = { x: specifiedPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(specifiedPositionX, 0.1);
				endPosition.y.should.be.approximately(i, 0.1);
			}
		});

		it('Should calculate the correct value in an diagonal move with positive end position (with endTick == -1).', function(){
			var startTick = 0,
				endTick = -1,
				specifiedStartPositionX = 0,
				specifiedEndPositionX = 10,
				specifiedStartPositionY = 0,
				specifiedEndPositionY = 10,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(i, 0.1);
				endPosition.y.should.be.approximately(i, 0.1);
			}
		});

		it('Should calculate the correct value in an horizotal move with negative end position (with endTick == -1).', function(){
			var startTick = 0,
				endTick = -1,
				specifiedPositionX = 0,
				specifiedStartPositionY = 10,
				specifiedEndPositionY = 0,
				specifiedStartPosition = { x: specifiedPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(specifiedPositionX, 0.1);
				endPosition.y.should.be.approximately(10 - i, 0.1);
			}
		});

		it('Should calculate the correct value in an vertical move with negative end position (with endTick == -1).', function(){
			var startTick = 0,
				endTick = -1,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedPositionY = 0,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an diagonal move with negative end position (with endTick == -1).', function(){
			var startTick = 0,
				endTick = -1,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedStartPositionY = 10,
				specifiedEndPositionY = 0,
				specifiedStartPosition = { x: specifiedStartPositionX, y: specifiedStartPositionY },
				specifiedEndPosition = { x: specifiedEndPositionX, y: specifiedEndPositionY },
				path = new Path({ startPosition: specifiedStartPosition, endPosition : specifiedEndPosition }),
				endPosition = path.getPositionFor(startTick, endTick, 0);

			for (var i = 0; i <= 10; i++) {
				endPosition = path.getPositionFor(startTick, endTick, i);
				should.notStrictEqual(endPosition, specifiedEndPosition);
				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(10 - i, 0.1);
			}
		});
	});
});
