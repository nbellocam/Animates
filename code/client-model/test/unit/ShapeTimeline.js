/*global require, describe, it */

var ShapeTimeline = require('../../src/ShapeTimeline'),
	should = require("should");

describe('ShapeTimeline', function(){
	describe('AnimationsCollections', function(){
		it('Should not contain any animation when created', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should add a new animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation = { property: "value" },
				animationId = 'myId';

			shapeTimeline.addAnimation(animationId, animation);
			animations = shapeTimeline.getAnimations();

			animations.should.not.be.empty;
			animations.should.have.property(animationId);
		});

		it('Should not add a new animation with invalid id', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation = { property: "value" },
				animationId;

			shapeTimeline.addAnimation(animationId, animation);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should not add a new invalid animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation,
				animationId = 'myId';

			shapeTimeline.addAnimation(animationId, animation);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should remove an animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation = { property: "value" },
				animationId = 'myId';

			shapeTimeline.addAnimation(animationId, animation);
			shapeTimeline.removeAnimation(animationId);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should not fail to remove a not existing animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animationId = 'myId';

			shapeTimeline.removeAnimation(animationId);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should not fail a call to remove with no parameter', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations;

			shapeTimeline.removeAnimation();
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});
	});

	describe('InitialFrame', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var shapeTimeline = new ShapeTimeline(),
				initialFrame = shapeTimeline.getInitialFrame();

			initialFrame.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedInitialFrame = 42,
				shapeTimeline = new ShapeTimeline({ initialFrame : specifiedInitialFrame }),
				initialFrame = shapeTimeline.getInitialFrame();

			initialFrame.should.be.exactly(specifiedInitialFrame);
		});

		it('Should start at the value specified using the set method', function(){
			var specifiedInitialFrame = 42,
				shapeTimeline = new ShapeTimeline(),
				initialFrame;

			shapeTimeline.setInitialFrame(specifiedInitialFrame);
			initialFrame = shapeTimeline.getInitialFrame();

			initialFrame.should.be.exactly(specifiedInitialFrame);
		});
	});

	describe('EndFrame', function(){
		it('Should end at -1 if it not specified otherwise (without animations)', function(){
			var shapeTimeline = new ShapeTimeline(),
				endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (without animations)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (without animations)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline(),
				endFrame;

			shapeTimeline.setEndFrame(specifiedEndFrame);
			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at -1 if it not specified otherwise (with animations that ends in -1)', function(){
			var shapeTimeline = new ShapeTimeline(),
				endFrame,
				animationId = 'myId',
				animation = { endFrame : -1 };

			shapeTimeline.addAnimation(animationId, animation);
			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (with animations that ends in -1)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				animationId = 'myId',
				animation = { endFrame : -1 };

			shapeTimeline.addAnimation(animationId, animation);
			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (with animations that ends in -1)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline(),
				endFrame,
				animationId = 'myId',
				animation = { endFrame : -1 };


			shapeTimeline.setEndFrame(specifiedEndFrame);
			shapeTimeline.addAnimation(animationId, animation);

			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified (with animations that ends before)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				animationId = 'myId',
				animation = { endFrame : 30 };


			shapeTimeline.addAnimation(animationId, animation);

			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value of the animation (with animations that ends after)', function(){
			var specifiedEndFrame = 42,
				animationEndFrame = 84,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				animationId = 'myId',
				animation = { endFrame : animationEndFrame };


			shapeTimeline.addAnimation(animationId, animation);

			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(animationEndFrame);
		});
	});

	describe('getShapeFrameFor', function(){
		it('Should return a ShapeFrame instance.'); /*, function(){
			var shapeTimeline = new ShapeTimeline(),
				frameNumber = 42,
				shapeFrame = shapeTimeline.getShapeFrameFor(frameNumber);

			shapeFrame.should.be.an.instanceOf(ShapeFrame);
		});*/

		it('Should not update the properties of a ShapeFrame if it has no animations.');

		it('Should update the properties of a ShapeFrame, based on the frame number as an animations specified.');

		it('Should update the properties of a ShapeFrame, based on the frame number as two continuos animations specified.');

		it('Should update the properties of a ShapeFrame, based on the frame number as two simultaneous animations specified.');

		it('Should not retrive a ShapeFrame if the frame is before the initialFrame');

		it('Should retrive the end ShapeFrame with no extra changes if the frame is after the endFrame');
	});
});
