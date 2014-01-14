/*global describe, it */

'use strict';

var MediaTimeline = require('../../src/mediaTimeline'),
	should = require("should");

describe('MediaTimeline', function(){
	describe('*effectsCollections', function(){
		it('Should not contain any effect when created.', function(){
			var mediaTimeline = new MediaTimeline(),
				effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should add a new effect.', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId',
				effect = { property: "value" , 'getGuid' : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			effects = mediaTimeline.getEffects();

			effects.should.not.be.empty;
			effects.should.have.property(effectId);
		});

		it('Should not add a new invalid effect.', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect;

			mediaTimeline.addEffect(effect);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should remove an effect.', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId',
				effect = { 'property': "value" , 'getGuid' : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			mediaTimeline.removeEffect(effectId);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail to remove a not existing effect.', function(){
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId';

			mediaTimeline.removeEffect(effectId);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail a call to remove with no parameter.', function(){
			var mediaTimeline = new MediaTimeline(),
				effects;

			mediaTimeline.removeEffect();
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});
	});

	describe('getMediaObjectId()', function(){
		it('Should return the media object id', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { 'getGuid' : function () { return specifiedMediaObjectId; } },
				mediaTimeline = new MediaTimeline( { 'mediaObject' : specifiedMediaObject } ),
				mediaObjectId = mediaTimeline.getMediaObjectId();

			mediaObjectId.should.be.exactly(specifiedMediaObjectId);
		});
	});

	describe('*startTick', function(){
		it('Should start at 0 if it not specified otherwise.', function(){
			var mediaTimeline = new MediaTimeline(),
				startTick = mediaTimeline.getStartTick();

			startTick.should.be.exactly(0);
		});

		it('Should start at the value specified using the constructor.', function(){
			var startTick = 42,
				mediaTimeline = new MediaTimeline({ 'startTick' : startTick });

			mediaTimeline.getStartTick().should.be.exactly(startTick);
		});

		it('Should start at the value specified using the set method.', function(){
			var startTick = 42,
				mediaTimeline = new MediaTimeline();

			mediaTimeline.setStartTick(startTick);
			mediaTimeline.getStartTick().should.be.exactly(startTick);
		});
	});

	describe('*endTick', function(){
		it('Should end at -1 if it not specified otherwise (without effects).', function(){
			var mediaTimeline = new MediaTimeline();

			mediaTimeline.getEndTick().should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (without effects).', function(){
			var endTick = 42,
				mediaTimeline = new MediaTimeline({ 'endTick' : endTick });

			mediaTimeline.getEndTick().should.be.exactly(endTick);
		});

		it('Should end at the value specified using the set method (without effects).', function(){
			var endTick = 42,
				mediaTimeline = new MediaTimeline();

			mediaTimeline.setEndTick(endTick);

			mediaTimeline.getEndTick().should.be.exactly(endTick);
		});

		it('Should end at -1 if it not specified otherwise (with effects that ends in -1).', function(){
			var mediaTimeline = new MediaTimeline(),
				effectId = 'myId',
				effectEndTick = -1,
				effect = { 'endTick' : effectEndTick, 'getGuid' : function () { return effectId; } };

			mediaTimeline.addEffect(effect);

			mediaTimeline.getEndTick().should.be.exactly(-1);
		});

		it('Should end at the value specified using the constructor (with effects that ends in -1).', function(){
			var endTick = 42,
				mediaTimeline = new MediaTimeline({ 'endTick' : endTick }),
				effectId = 'myId',
				effectEndTick = -1,
				effect = { 'endTick' : effectEndTick, 'getGuid' : function () { return effectId; } };

			mediaTimeline.addEffect(effect);

			mediaTimeline.getEndTick().should.be.exactly(endTick);
		});

		it('Should end at the value specified using the set method (with effects that ends in -1).', function(){
			var endTick = 42,
				mediaTimeline = new MediaTimeline(),
				effectId = 'myId',
				effectEndTick = -1,
				effect = { 'endTick' : effectEndTick, 'getGuid' : function () { return effectId; } };


			mediaTimeline.setEndTick(endTick);
			mediaTimeline.addEffect(effect);

			mediaTimeline.getEndTick().should.be.exactly(endTick);
		});

		it('Should end at the value specified (with effects that ends before).', function(){
			var endTick = 42,
				mediaTimeline = new MediaTimeline({ 'endTick' : endTick }),
				effectId = 'myId',
				effectEndTick = 30,
				effect = { 'endTick' : effectEndTick, 'getGuid' : function () { return effectId; } };


			mediaTimeline.addEffect(effect);

			mediaTimeline.getEndTick().should.be.exactly(endTick);
		});

		it('Should end at the value of the effect (with effects that ends after).', function(){
			var endTick = 42,
				effectEndTick = 84,
				mediaTimeline = new MediaTimeline({ 'endTick' : endTick }),
				effectId = 'myId',
				effect = { 'endTick' : effectEndTick, 'getGuid' : function () { return effectId; } };


			mediaTimeline.addEffect(effect);

			mediaTimeline.getEndTick().should.be.exactly(effectEndTick);
		});
	});

	describe('getMediaFrameFor()', function(){
		it('Should return a new mediaFrame when no effects are present.', function(){
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 0);
		});

		it('Should not retrive a MediaFrame if the frame is before the initialFrame.', function(){
			var currentTick = 42,
				startTick = 100,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { startTick: startTick, mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			should.not.exists(mediaFrame);
		});

		it('Should return a new mediaFrame when effects are present but start before the current frame.', function(){
			var currentTick = 1,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick = 2,
				effectEndTick = 5,
				effectId = 'myId',
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effect = {
					'startTick' : effectStartTick,
					'endTick' : effectEndTick,
					'getGuid' : function () { return effectId; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 0);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as an effects specified.', function(){
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick = 2,
				effectEndTick = 5,
				effectId = 'myId',
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effect = {
					'startTick' : effectStartTick,
					'endTick' : effectEndTick,
					'getGuid' : function () { return effectId; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should retrive the end MediaFrame with no extra changes if the frame is after the endTick.', function(){
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick = 2,
				effectEndTick = 5,
				effectId = 'myId',
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effect = {
					'startTick' : effectStartTick,
					'endTick' : effectEndTick,
					'getGuid' : function () { return effectId; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 4);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first, only one effect).', function(){
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'startTick' : effectStartTick1,
					'endTick' : effectEndTick1,
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					'startTick' : effectStartTick2,
					'endTick' : effectEndTick2,
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last, only one effect).', function(){
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					'startTick' : effectStartTick1,
					'endTick' : effectEndTick1,
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					'startTick' : effectStartTick2,
					'endTick' : effectEndTick2,
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first).', function(){
			var currentTick = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'startTick' : effectStartTick1,
					'endTick' : effectEndTick1,
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					'startTick' : effectStartTick2,
					'endTick' : effectEndTick2,
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 11);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last).', function(){
			var currentTick = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					'startTick' : effectStartTick1,
					'endTick' : effectEndTick1,
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					'startTick' : effectStartTick2,
					'endTick' : effectEndTick2,
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 11);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two simultaneous effects specified.', function(){
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0, y : 0 },
				specifiedMediaObject = { 
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'startTick' : effectStartTick1,
					'endTick' : effectEndTick1,
					'getGuid' : function () { return effectId1; },
					'getProperties' : function (tick, mediaFrameProperties) {
						mediaFrameProperties.x += (tick - 1);
						return mediaFrameProperties;
					}
				},
				effectStartTick2 = 2,
				effectEndTick2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					'startTick' : effectStartTick2,
					'endTick' : effectEndTick2,
					'getGuid' : function () { return effectId2; },
					'getProperties' : function (tick, mediaFrameProperties) {
						mediaFrameProperties.y += (tick - 1);
						return mediaFrameProperties;
					},
				},
				properties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			properties = mediaFrame.properties();
			properties.should.have.property('x', 2);
			properties.should.have.property('y', 2);
		});
		
		it('Should update the properties of a MediaFrame when endFrame is -1.');
	});
});