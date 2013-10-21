/*global require, describe, it */

var ShapeTimeline = require('../../src/shapeTimeline'),
	should = require("should");

describe('ShapeTimeline', function(){
	describe('EffectsCollections', function(){
		it('Should not contain any effect when created', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects = shapeTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should add a new effect', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects,
				effect = { property: "value" },
				effectId = 'myId';

			shapeTimeline.addEffect(effectId, effect);
			effects = shapeTimeline.getEffects();

			effects.should.not.be.empty;
			effects.should.have.property(effectId);
		});

		it('Should not add a new effect with invalid id', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects,
				effect = { property: "value" },
				effectId;

			shapeTimeline.addEffect(effectId, effect);
			effects = shapeTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not add a new invalid effect', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects,
				effect,
				effectId = 'myId';

			shapeTimeline.addEffect(effectId, effect);
			effects = shapeTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should remove an effect', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects,
				effect = { property: "value" },
				effectId = 'myId';

			shapeTimeline.addEffect(effectId, effect);
			shapeTimeline.removeEffect(effectId);
			effects = shapeTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail to remove a not existing effect', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects,
				effectId = 'myId';

			shapeTimeline.removeEffect(effectId);
			effects = shapeTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail a call to remove with no parameter', function(){
			var shapeTimeline = new ShapeTimeline(),
				effects;

			shapeTimeline.removeEffect();
			effects = shapeTimeline.getEffects();

			effects.should.be.empty;
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
		it('Should end at -1 if it not specified otherwise (without effects)', function(){
			var shapeTimeline = new ShapeTimeline(),
				endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (without effects)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (without effects)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline(),
				endFrame;

			shapeTimeline.setEndFrame(specifiedEndFrame);
			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at -1 if it not specified otherwise (with effects that ends in -1)', function(){
			var shapeTimeline = new ShapeTimeline(),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : -1 };

			shapeTimeline.addEffect(effectId, effect);
			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (with effects that ends in -1)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : -1 };

			shapeTimeline.addEffect(effectId, effect);
			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (with effects that ends in -1)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline(),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : -1 };


			shapeTimeline.setEndFrame(specifiedEndFrame);
			shapeTimeline.addEffect(effectId, effect);

			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified (with effects that ends before)', function(){
			var specifiedEndFrame = 42,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : 30 };


			shapeTimeline.addEffect(effectId, effect);

			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value of the effect (with effects that ends after)', function(){
			var specifiedEndFrame = 42,
				effectEndFrame = 84,
				shapeTimeline = new ShapeTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : effectEndFrame };


			shapeTimeline.addEffect(effectId, effect);

			endFrame = shapeTimeline.getEndFrame();

			endFrame.should.be.exactly(effectEndFrame);
		});
	});

	describe('getShapeFrameFor', function(){
		it('Should return a ShapeFrame instance.'); /*, function(){
			var shapeTimeline = new ShapeTimeline(),
				frameNumber = 42,
				shapeFrame = shapeTimeline.getShapeFrameFor(frameNumber);

			shapeFrame.should.be.an.instanceOf(ShapeFrame);
		});*/

		it('Should not update the properties of a ShapeFrame if it has no effects.');

		it('Should update the properties of a ShapeFrame, based on the frame number as an effects specified.');

		it('Should update the properties of a ShapeFrame, based on the frame number as two continuos effects specified.');

		it('Should update the properties of a ShapeFrame, based on the frame number as two simultaneous effects specified.');

		it('Should not retrive a ShapeFrame if the frame is before the initialFrame');

		it('Should retrive the end ShapeFrame with no extra changes if the frame is after the endFrame');
	});
});
