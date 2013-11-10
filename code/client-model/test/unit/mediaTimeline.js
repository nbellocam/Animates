/*global describe, it */

'use strict';

var MediaTimeline = require('../../src/mediaTimeline'),
	should = require("should");

describe('MediaTimeline', function(){
	describe('EffectsCollections', function(){
		it('Should not contain any effect when created', function(){
			var mediaTimeline = new MediaTimeline(),
				effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should add a new effect', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect = { property: "value" },
				effectId = 'myId';

			mediaTimeline.addEffect(effectId, effect);
			effects = mediaTimeline.getEffects();

			effects.should.not.be.empty;
			effects.should.have.property(effectId);
		});

		it('Should not add a new effect with invalid id', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect = { property: "value" },
				effectId;

			mediaTimeline.addEffect(effectId, effect);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not add a new invalid effect', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect,
				effectId = 'myId';

			mediaTimeline.addEffect(effectId, effect);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should remove an effect', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect = { property: "value" },
				effectId = 'myId';

			mediaTimeline.addEffect(effectId, effect);
			mediaTimeline.removeEffect(effectId);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail to remove a not existing effect', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId';

			mediaTimeline.removeEffect(effectId);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail a call to remove with no parameter', function(){
			var mediaTimeline = new MediaTimeline(),
				effects;

			mediaTimeline.removeEffect();
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});
	});

	describe('getMediaObjectId', function(){
		it('Should return the media object id', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaObjectId = mediaTimeline.getMediaObjectId();

			mediaObjectId.should.be.exactly(specifiedMediaObjectId);
		});
	});

	describe('StartFrame', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var mediaTimeline = new MediaTimeline(),
				startFrame = mediaTimeline.getStartFrame();

			startFrame.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedStartFrame = 42,
				mediaTimeline = new MediaTimeline({ startFrame : specifiedStartFrame }),
				startFrame = mediaTimeline.getStartFrame();

			startFrame.should.be.exactly(specifiedStartFrame);
		});

		it('Should start at the value specified using the set method', function(){
			var specifiedStartFrame = 42,
				mediaTimeline = new MediaTimeline(),
				startFrame;

			mediaTimeline.setStartFrame(specifiedStartFrame);
			startFrame = mediaTimeline.getStartFrame();

			startFrame.should.be.exactly(specifiedStartFrame);
		});
	});

	describe('EndFrame', function(){
		it('Should end at -1 if it not specified otherwise (without effects)', function(){
			var mediaTimeline = new MediaTimeline(),
				endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (without effects)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (without effects)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline(),
				endFrame;

			mediaTimeline.setEndFrame(specifiedEndFrame);
			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at -1 if it not specified otherwise (with effects that ends in -1)', function(){
			var mediaTimeline = new MediaTimeline(),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : -1 };

			mediaTimeline.addEffect(effectId, effect);
			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (with effects that ends in -1)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : -1 };

			mediaTimeline.addEffect(effectId, effect);
			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (with effects that ends in -1)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline(),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : -1 };


			mediaTimeline.setEndFrame(specifiedEndFrame);
			mediaTimeline.addEffect(effectId, effect);

			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified (with effects that ends before)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : 30 };


			mediaTimeline.addEffect(effectId, effect);

			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value of the effect (with effects that ends after)', function(){
			var specifiedEndFrame = 42,
				effectEndFrame = 84,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : effectEndFrame };


			mediaTimeline.addEffect(effectId, effect);

			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(effectEndFrame);
		});
	});

	describe('getMediaObjectFrameFor', function(){
		it('Should return a MediaFrame instance.'); /*, function(){
			var mediaTimeline = new ShapeTimeline(),
				frameNumber = 42,
				shapeFrame = shapeTimeline.getShapeFrameFor(frameNumber);

			shapeFrame.should.be.an.instanceOf(ShapeFrame);
		});*/

		it('Should not update the properties of a MediaFrame if it has no effects.');

		it('Should update the properties of a MediaFrame, based on the frame number as an effects specified.');

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified.');

		it('Should update the properties of a MediaFrame, based on the frame number as two simultaneous effects specified.');

		it('Should not retrive a MediaFrame if the frame is before the initialFrame');

		it('Should retrive the end MediaFrame with no extra changes if the frame is after the endFrame');
	});
});
