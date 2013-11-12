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

	describe('StartFrameNumber', function(){
		it('Should start at 0 if it not specified otherwise', function(){
			var mediaTimeline = new MediaTimeline(),
				startFrameNumber = mediaTimeline.getStartFrameNumber();

			startFrameNumber.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor', function(){
			var specifiedStartFrameNumber = 42,
				mediaTimeline = new MediaTimeline({ startFrameNumber : specifiedStartFrameNumber }),
				startFrameNumber = mediaTimeline.getStartFrameNumber();

			startFrameNumber.should.be.exactly(specifiedStartFrameNumber);
		});

		it('Should start at the value specified using the set method', function(){
			var specifiedStartFrameNumber = 42,
				mediaTimeline = new MediaTimeline(),
				startFrameNumber;

			mediaTimeline.setStartFrameNumber(specifiedStartFrameNumber);
			startFrameNumber = mediaTimeline.getStartFrameNumber();

			startFrameNumber.should.be.exactly(specifiedStartFrameNumber);
		});
	});

	describe('EndFrameNumber', function(){
		it('Should end at -1 if it not specified otherwise (without effects)', function(){
			var mediaTimeline = new MediaTimeline(),
				endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (without effects)', function(){
			var specifiedEndFrameNumber = 42,
				mediaTimeline = new MediaTimeline({ endFrameNumber : specifiedEndFrameNumber }),
				endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(specifiedEndFrameNumber);
		});

		it('Should end at the value specified using the set method (without effects)', function(){
			var specifiedEndFrameNumber = 42,
				mediaTimeline = new MediaTimeline(),
				endFrameNumber;

			mediaTimeline.setEndFrameNumber(specifiedEndFrameNumber);
			endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(specifiedEndFrameNumber);
		});

		it('Should end at -1 if it not specified otherwise (with effects that ends in -1)', function(){
			var mediaTimeline = new MediaTimeline(),
				endFrameNumber,
				effectId = 'myId',
				effectEndFrameNumber = -1,
				effect = { endFrameNumber : effectEndFrameNumber, getGuid : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (with effects that ends in -1)', function(){
			var specifiedEndFrameNumber = 42,
				mediaTimeline = new MediaTimeline({ endFrameNumber : specifiedEndFrameNumber }),
				endFrameNumber,
				effectId = 'myId',
				effectEndFrameNumber = -1,
				effect = { endFrameNumber : effectEndFrameNumber, getGuid : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(specifiedEndFrameNumber);
		});

		it('Should end at the value specified using the set method (with effects that ends in -1)', function(){
			var specifiedEndFrameNumber = 42,
				mediaTimeline = new MediaTimeline(),
				endFrameNumber,
				effectId = 'myId',
				effectEndFrameNumber = -1,
				effect = { endFrameNumber : effectEndFrameNumber, getGuid : function () { return effectId; } };


			mediaTimeline.setEndFrameNumber(specifiedEndFrameNumber);
			mediaTimeline.addEffect(effect);

			endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(specifiedEndFrameNumber);
		});

		it('Should end at the value specified (with effects that ends before)', function(){
			var specifiedEndFrameNumber = 42,
				mediaTimeline = new MediaTimeline({ endFrameNumber : specifiedEndFrameNumber }),
				endFrameNumber,
				effectId = 'myId',
				effectEndFrameNumber = 30,
				effect = { endFrameNumber : effectEndFrameNumber, getGuid : function () { return effectId; } };


			mediaTimeline.addEffect(effect);

			endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(specifiedEndFrameNumber);
		});

		it('Should end at the value of the effect (with effects that ends after)', function(){
			var specifiedEndFrameNumber = 42,
				effectEndFrameNumber = 84,
				mediaTimeline = new MediaTimeline({ endFrameNumber : specifiedEndFrameNumber }),
				endFrameNumber,
				effectId = 'myId',
				effect = { endFrameNumber : effectEndFrameNumber, getGuid : function () { return effectId; } };


			mediaTimeline.addEffect(effect);

			endFrameNumber = mediaTimeline.getEndFrameNumber();

			endFrameNumber.should.be.exactly(effectEndFrameNumber);
		});
	});

	describe('getMediaFrameFor', function(){
		it('Should return a new mediaFrame when no effects are present.', function(){
			var currentFrameNumber = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 0);
		});

		it('Should not retrive a MediaFrame if the frame is before the initialFrame', function(){
			var currentFrameNumber = 42,
				specifiedStartFrameNumber = 100,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { startFrameNumber: specifiedStartFrameNumber, mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			should.not.exists(mediaFrame);
		});

		it('Should return a new mediaFrame when effects are present but start before the current frame.', function(){
			var currentFrameNumber = 1,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrameNumber = 2,
				effectEndFrameNumber = 5,
				effectId = 'myId',
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effect = {
					startFrameNumber : effectStartFrameNumber,
					endFrameNumber : effectEndFrameNumber,
					getGuid : function () { return effectId; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 0);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as an effects specified.', function(){
			var currentFrameNumber = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrameNumber = 2,
				effectEndFrameNumber = 5,
				effectId = 'myId',
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effect = {
					startFrameNumber : effectStartFrameNumber,
					endFrameNumber : effectEndFrameNumber,
					getGuid : function () { return effectId; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should retrive the end MediaFrame with no extra changes if the frame is after the endFrameNumber', function(){
			var currentFrameNumber = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrameNumber = 2,
				effectEndFrameNumber = 5,
				effectId = 'myId',
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effect = {
					startFrameNumber : effectStartFrameNumber,
					endFrameNumber : effectEndFrameNumber,
					getGuid : function () { return effectId; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 4);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first, only one effect)', function(){
			var currentFrameNumber = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effectStartFrameNumber1 = 2,
				effectEndFrameNumber1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					startFrameNumber : effectStartFrameNumber1,
					endFrameNumber : effectEndFrameNumber1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				},
				effectStartFrameNumber2 = 6,
				effectEndFrameNumber2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					startFrameNumber : effectStartFrameNumber2,
					endFrameNumber : effectEndFrameNumber2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last, only one effect)', function(){
			var currentFrameNumber = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effectStartFrameNumber1 = 2,
				effectEndFrameNumber1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					startFrameNumber : effectStartFrameNumber1,
					endFrameNumber : effectEndFrameNumber1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				},
				effectStartFrameNumber2 = 6,
				effectEndFrameNumber2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					startFrameNumber : effectStartFrameNumber2,
					endFrameNumber : effectEndFrameNumber2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first)', function(){
			var currentFrameNumber = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effectStartFrameNumber1 = 2,
				effectEndFrameNumber1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					startFrameNumber : effectStartFrameNumber1,
					endFrameNumber : effectEndFrameNumber1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				},
				effectStartFrameNumber2 = 6,
				effectEndFrameNumber2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					startFrameNumber : effectStartFrameNumber2,
					endFrameNumber : effectEndFrameNumber2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 11);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last)', function(){
			var currentFrameNumber = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesForFrameFunction = function (frameNumber, beginMediaFrameProperties) {
					beginMediaFrameProperties.x += (frameNumber - 1);
					return beginMediaFrameProperties;
				},
				effectStartFrameNumber1 = 2,
				effectEndFrameNumber1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					startFrameNumber : effectStartFrameNumber1,
					endFrameNumber : effectEndFrameNumber1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				},
				effectStartFrameNumber2 = 6,
				effectEndFrameNumber2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					startFrameNumber : effectStartFrameNumber2,
					endFrameNumber : effectEndFrameNumber2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : getPropertiesForFrameFunction
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 11);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two simultaneous effects specified.', function(){
			var currentFrameNumber = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0, y : 0 },
				specifiedMediaObject = { 
					getGuid : function () { return specifiedMediaObjectId; },
					getProperties : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartFrameNumber1 = 2,
				effectEndFrameNumber1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					startFrameNumber : effectStartFrameNumber1,
					endFrameNumber : effectEndFrameNumber1,
					getGuid : function () { return effectId1; },
					getPropertiesForFrame : function (frameNumber, beginMediaFrameProperties) {
						beginMediaFrameProperties.x += (frameNumber - 1);
						return beginMediaFrameProperties;
					}
				},
				effectStartFrameNumber2 = 2,
				effectEndFrameNumber2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					startFrameNumber : effectStartFrameNumber2,
					endFrameNumber : effectEndFrameNumber2,
					getGuid : function () { return effectId2; },
					getPropertiesForFrame : function (frameNumber, beginMediaFrameProperties) {
						beginMediaFrameProperties.y += (frameNumber - 1);
						return beginMediaFrameProperties;
					},
				},
				properties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentFrameNumber);

			mediaFrame.should.exists;
			properties = mediaFrame.properties();
			properties.should.have.property('x', 2);
			properties.should.have.property('y', 2);
		});
	});
});
