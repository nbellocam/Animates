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
				effectId = 'myId',
				effect = { property: "value" , getGuid : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			effects = mediaTimeline.getEffects();

			effects.should.not.be.empty;
			effects.should.have.property(effectId);
		});

		it('Should not add a new invalid effect', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect;

			mediaTimeline.addEffect(effect);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should remove an effect', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId',
				effect = { property: "value" , getGuid : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
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
				effectEndFrame = -1,
				effect = { endFrame : effectEndFrame, getGuid : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (with effects that ends in -1)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effectEndFrame = -1,
				effect = { endFrame : effectEndFrame, getGuid : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified using the set method (with effects that ends in -1)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline(),
				endFrame,
				effectId = 'myId',
				effectEndFrame = -1,
				effect = { endFrame : effectEndFrame, getGuid : function () { return effectId; } };


			mediaTimeline.setEndFrame(specifiedEndFrame);
			mediaTimeline.addEffect(effect);

			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value specified (with effects that ends before)', function(){
			var specifiedEndFrame = 42,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effectEndFrame = 30,
				effect = { endFrame : effectEndFrame, getGuid : function () { return effectId; } };


			mediaTimeline.addEffect(effect);

			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(specifiedEndFrame);
		});

		it('Should end at the value of the effect (with effects that ends after)', function(){
			var specifiedEndFrame = 42,
				effectEndFrame = 84,
				mediaTimeline = new MediaTimeline({ endFrame : specifiedEndFrame }),
				endFrame,
				effectId = 'myId',
				effect = { endFrame : effectEndFrame, getGuid : function () { return effectId; } };


			mediaTimeline.addEffect(effect);

			endFrame = mediaTimeline.getEndFrame();

			endFrame.should.be.exactly(effectEndFrame);
		});
	});

	describe('getMediaFrameFor', function(){
		it('Should return a new mediaFrame when no effects are present.', function(){
			var currentFrame = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO check properties
		});

		it('Should not retrive a MediaFrame if the frame is before the initialFrame', function(){
			var currentFrame = 42,
				specifiedStartFrame = 100,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { startFrame: specifiedStartFrame, mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			should.not.exists(mediaFrame);
		});

		it('Should return a new mediaFrame when effects are present but start before the current frame.', function(){
			var currentFrame = 1,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame = 2,
				effectEndFrame = 5,
				effectId = 'myId',
				effect = {
					startFrame : effectStartFrame,
					endFrame : effectEndFrame,
					getGuid : function () { return effectId; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be 0
		});

		it('Should update the properties of a MediaFrame, based on the frame number as an effects specified.', function(){
			var currentFrame = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame = 2,
				effectEndFrame = 5,
				effectId = 'myId',
				effect = {
					startFrame : effectStartFrame,
					endFrame : effectEndFrame,
					getGuid : function () { return effectId; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 2
		});

		it('Should retrive the end MediaFrame with no extra changes if the frame is after the endFrame', function(){
			var currentFrame = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame = 2,
				effectEndFrame = 5,
				effectId = 'myId',
				effect = {
					startFrame : effectStartFrame,
					endFrame : effectEndFrame,
					getGuid : function () { return effectId; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 4
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first, only one effect)', function(){
			var currentFrame = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame1 = 2,
				effectEndFrame1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					startFrame : effectStartFrame1,
					endFrame : effectEndFrame1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				},
				effectStartFrame2 = 6,
				effectEndFrame2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					startFrame : effectStartFrame2,
					endFrame : effectEndFrame2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 2
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last, only one effect)', function(){
			var currentFrame = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame1 = 2,
				effectEndFrame1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					startFrame : effectStartFrame1,
					endFrame : effectEndFrame1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				},
				effectStartFrame2 = 6,
				effectEndFrame2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					startFrame : effectStartFrame2,
					endFrame : effectEndFrame2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 2
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first)', function(){
			var currentFrame = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame1 = 2,
				effectEndFrame1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					startFrame : effectStartFrame1,
					endFrame : effectEndFrame1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				},
				effectStartFrame2 = 6,
				effectEndFrame2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					startFrame : effectStartFrame2,
					endFrame : effectEndFrame2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 7
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last)', function(){
			var currentFrame = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame1 = 2,
				effectEndFrame1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					startFrame : effectStartFrame1,
					endFrame : effectEndFrame1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				},
				effectStartFrame2 = 6,
				effectEndFrame2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					startFrame : effectStartFrame2,
					endFrame : effectEndFrame2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 7
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two simultaneous effects specified.', function(){
			var currentFrame = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0, y : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrame1 = 2,
				effectEndFrame1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					startFrame : effectStartFrame1,
					endFrame : effectEndFrame1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.x += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				},
				effectStartFrame2 = 2,
				effectEndFrame2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					startFrame : effectStartFrame2,
					endFrame : effectEndFrame2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : function (frame, beginShapeFrame) {
						beginShapeFrame.y += (frame - 1);
						//TODO update to modify the property in the correct way.
						return beginShapeFrame;
					}
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrame);

			mediaFrame.should.exists;
			//TODO update to check the value of the property, should be x === 2, y ===2
		});

	});
});
