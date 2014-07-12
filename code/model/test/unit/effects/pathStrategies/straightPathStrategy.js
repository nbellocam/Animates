/*global describe, it */

'use strict';

var straightPathStrategy = require('../../../../src/effects/pathStrategies/straightPathStrategy'),
	should = require("should");

describe('straightPathStrategy', function() {
	describe('getPositionFor()', function() {
		it('Should return an object with no x and y properties if currentTick is less than startTick', function() {
			var startTick = 10,
				endTick = 20,
				currentTick = 5,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedEndPositionY }
				},
				endPosition = straightPathStrategy(currentTick, [specifiedStartPoint, specifiedEndPoint]);

			endPosition.should.not.have.properties('x', 'y');
		});

		it('Should return a copy of the endPosition if currentTick is greater than endTick.', function() {
			var startTick = 10,
				endTick = 20,
				currentTick = 30,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedEndPositionY }
				},
				endPosition = straightPathStrategy(currentTick, [specifiedStartPoint, specifiedEndPoint]);

			should.notStrictEqual(endPosition, specifiedEndPoint.position);
			endPosition.should.have.property('x', specifiedEndPositionX);
			endPosition.should.have.property('y', specifiedEndPositionY);
		});

		it('Should return a copy of the startPosition if currentTick is exactly the startTick.', function() {
			var startTick = 10,
				endTick = 20,
				currentTick = startTick,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedEndPositionY }
				},
				endPosition = straightPathStrategy(currentTick, [specifiedStartPoint, specifiedEndPoint]);

			should.notStrictEqual(endPosition, specifiedStartPoint.position);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedStartPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedStartPositionY, 0.1);
		});

		it('Should return a copy of the endPosition if currentTick is exactly the endTick.', function() {
			var startTick = 10,
				endTick = 20,
				currentTick = endTick,
				specifiedStartPositionX = 20,
				specifiedStartPositionY = 10,
				specifiedEndPositionX = 200,
				specifiedEndPositionY = 100,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedEndPositionY }
				},
				endPosition = straightPathStrategy(currentTick, [specifiedStartPoint, specifiedEndPoint]);

			should.notStrictEqual(endPosition, specifiedEndPoint.position);
			endPosition.should.have.property('x');
			endPosition.should.have.property('y');
			endPosition.x.should.be.approximately(specifiedEndPositionX, 0.1);
			endPosition.y.should.be.approximately(specifiedEndPositionY, 0.1);
		});

		it('Should calculate the correct value in an horizotal move with positive end position.', function() {
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 0,
				specifiedEndPositionX = 10,
				specifiedPositionY = 10,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedPositionY }
				},
				endPosition;

			for (var i = 0; i < 10; i++) {
				endPosition = straightPathStrategy(i, [specifiedStartPoint, specifiedEndPoint]);

				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an vertical move with positive end position.', function() {
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionY = 0,
				specifiedEndPositionY = 10,
				specifiedPositionX = 10,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedPositionX, y: specifiedEndPositionY }
				},
				endPosition;

			for (var i = 0; i < 10; i++) {
				endPosition = straightPathStrategy(i, [specifiedStartPoint, specifiedEndPoint]);

				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(specifiedPositionX, 0.1);
				endPosition.y.should.be.approximately(i, 0.1);
			}
		});

		it('Should calculate the correct value in an diagonal move with positive end position.', function() {
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionY = 0,
				specifiedEndPositionY = 10,
				specifiedStartPositionX = 0,
				specifiedEndPositionX = 10,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedEndPositionY }
				},
				endPosition;

			for (var i = 0; i < 10; i++) {
				endPosition = straightPathStrategy(i, [specifiedStartPoint, specifiedEndPoint]);

				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(i, 0.1);
				endPosition.y.should.be.approximately(i, 0.1);
			}
		});

		it('Should calculate the correct value in an vertical move with negative end position.', function() {
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedPositionY = 10,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedPositionY }
				},
				endPosition;

			for (var i = 0; i < 10; i++) {
				endPosition = straightPathStrategy(i, [specifiedStartPoint, specifiedEndPoint]);

				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an horizontal move with negative end position.', function() {
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedPositionY = 10,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedPositionY }
				},
				endPosition;

			for (var i = 0; i < 10; i++) {
				endPosition = straightPathStrategy(i, [specifiedStartPoint, specifiedEndPoint]);

				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(specifiedPositionY, 0.1);
			}
		});

		it('Should calculate the correct value in an diagonal move with negative end position.', function() {
			var startTick = 0,
				endTick = 10,
				specifiedStartPositionY = 10,
				specifiedEndPositionY = 0,
				specifiedStartPositionX = 10,
				specifiedEndPositionX = 0,
				specifiedStartPoint = {
					tick: startTick,
					position: { x: specifiedStartPositionX, y: specifiedStartPositionY }
				},
				specifiedEndPoint = {
					tick: endTick,
					position: { x: specifiedEndPositionX, y: specifiedEndPositionY }
				},
				endPosition;

			for (var i = 0; i < 10; i++) {
				endPosition = straightPathStrategy(i, [specifiedStartPoint, specifiedEndPoint]);

				endPosition.should.have.property('x');
				endPosition.should.have.property('y');
				endPosition.x.should.be.approximately(10 - i, 0.1);
				endPosition.y.should.be.approximately(10 - i, 0.1);
			}
		});
	});
});
