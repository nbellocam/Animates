/*global describe, it */

'use strict';

var MoveEffect = require('../../src/effects/moveEffect'),
	Rectangle = require('../../src/shapes/rectangle'),
	Timeline = require('../../src/timeline'),
	MediaFrame = require('../../src/mediaFrame'),
	MediaTimeline = require('../../src/mediaTimeline'),
	Path = require('../../src/utils/path'),
	should = require("should");

var utils = {
	createSpecifiedProperties : function () {
		return {
			position : {
				x : 0,
				y : 0,
				z : 3
			},
			opacity: 0.9,
			border : {
				type : 'border',
				color : 'blue'
			},
			height: 32,
			width: 84
		};
	},
	testMediaFrameProperties : function (properties, specifiedProperties, expectedX, expectedY){
		properties.should.have.property('position');
		properties.position.should.have.property('x', expectedX);
		properties.position.should.have.property('y', expectedY);
		properties.position.should.have.property('z', specifiedProperties.position.z);
		properties.should.have.property('opacity', specifiedProperties.opacity);
		properties.should.have.property('border');
		properties.border.should.have.property('type', specifiedProperties.border.type);
		properties.border.should.have.property('color', specifiedProperties.border.color);

		properties.should.have.property('height', specifiedProperties.height);
		properties.should.have.property('width', specifiedProperties.width);
	},
	testMediaFrameCollection : function (timeline, specificTick){
		var mediaFramesCollection = timeline.getMediaFrames(specificTick);
		should.exists(mediaFramesCollection);
		mediaFramesCollection.should.have.lengthOf(1);

		var mediaFrame = mediaFramesCollection[0];

		should.exists(mediaFrame);
		mediaFrame.should.be.instanceOf(MediaFrame);

		return mediaFrame;
	}
};

describe('Retrive all MediaFrames for a specific frame number from the Timeline', function(){
	describe('One rectangle', function(){
		it('Should retrive the MediaFrame object related to the rectangle', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificTick = 42,
				mediaTimeline,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle);

			// Test
			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			mediaFrame = utils.testMediaFrameCollection(timeline, specificTick);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specifiedProperties.position.x, specifiedProperties.position.y);
		});

		it('Should retrive the MediaFrame object related to the rectangle updated with the move effect', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificEndTick = 42,
				specificTick = specificEndTick / 2,
				specifiedEndPosition = { x: specificEndTick, y: specificEndTick },
				specifiedPath = new Path({ endPosition : specifiedEndPosition }),
				moveEffect = new MoveEffect({ path: specifiedPath, endTick: specificEndTick }),
				mediaTimeline,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle);

			// Test
			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			// Add effects
			mediaTimeline.addEffect(moveEffect);
			
			// Basic effect test
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());
			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			// mediaFrameCollection for time "specificEndTick"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificEndTick);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificEndTick, specificEndTick);

			// mediaFrameCollection for time "specificTick"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificTick);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick, specificTick);

			// mediaFrameCollection for time "0"
			mediaFrame = utils.testMediaFrameCollection(timeline, 0);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specifiedProperties.position.x, specifiedProperties.position.y);

			// mediaFrameCollection for time "specificEndTick"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificEndTick * 2);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificEndTick, specificEndTick);
		});

		it('Should retrive the MediaFrame object related to the rectangle updated with two continuous move effects', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificEndTick1 = 42,
				specificTick1 = specificEndTick1 / 2,
				specifiedEndPosition1 = { x: specificEndTick1, y: specificEndTick1 },
				specifiedPath1 = new Path({ endPosition : specifiedEndPosition1 }),
				moveEffect1 = new MoveEffect({ path: specifiedPath1, endTick: specificEndTick1 }),
				specificEndTick2 = specificEndTick1 * 2,
				specificTick2 = specificTick1 + specificEndTick1,
				specifiedEndPosition2 = { x: 0, y: 0 },
				specifiedPath2 = new Path({ startPosition: specifiedEndPosition1, endPosition : specifiedEndPosition2 }),
				moveEffect2 = new MoveEffect({ path: specifiedPath2, startTick: specificEndTick1, endTick: specificEndTick2 }),
				mediaTimeline,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle);

			// Test
			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			// Add effects
			mediaTimeline.addEffect(moveEffect1);
			mediaTimeline.addEffect(moveEffect2);
			
			// Basic effect test
			mediaTimeline.getEffects().should.have.property(moveEffect1.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect2.getGuid());
			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect1.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect2.getGuid());

			// mediaFrameCollection for time "specificEndTick1"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificEndTick1);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificEndTick1, specificEndTick1);

			// mediaFrameCollection for time "specificTick1"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificTick1);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick1, specificTick1);

			// mediaFrameCollection for time "0"
			mediaFrame = utils.testMediaFrameCollection(timeline, 0);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, 0, 0);

			// mediaFrameCollection for time "specificEndTick2"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificEndTick2);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, 0, 0);

			// mediaFrameCollection for time "specificTick2"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificTick2);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick1, specificTick1);

			// mediaFrameCollection for time "specificTick2"
			mediaFrame = utils.testMediaFrameCollection(timeline, specificEndTick2 * 2);
			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, 0, 0);
		});

		it('Should retrive the MediaFrame objects related to the two rectangles', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle1 = new Rectangle(specifiedProperties),
				rectangle2 = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificTick = 42,
				mediaTimeline,
				mediaFramesCollection,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle1);
			timeline.addMediaObject(rectangle2);

			// MediaTimelines tests
			mediaTimeline = timeline.getMediaTimeline(rectangle1.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			mediaTimeline = timeline.getMediaTimeline(rectangle2.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			//MediaFrames tests
			mediaFramesCollection = timeline.getMediaFrames(specificTick);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(2);

			// First rectangle
			mediaFrame = mediaFramesCollection[0];
			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specifiedProperties.position.x, specifiedProperties.position.y);

			// Second rectangle
			mediaFrame = mediaFramesCollection[1];
			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specifiedProperties.position.x, specifiedProperties.position.y);
		});

		it('Should retrive the MediaFrame objects related to the two rectangles, one of them updated with the move effect', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle1 = new Rectangle(specifiedProperties),
				rectangle2 = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificTick = 42,
				specificTick2 = specificTick / 2,
				specifiedEndPosition = { x: specificTick, y: specificTick },
				specifiedPath = new Path({ endPosition : specifiedEndPosition }),
				moveEffect = new MoveEffect({ path: specifiedPath, endTick: specificTick }),
				mediaTimeline,
				mediaFramesCollection,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle1);
			timeline.addMediaObject(rectangle2);

			//First rectangle add effect
			mediaTimeline = timeline.getMediaTimeline(rectangle1.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);
			
			mediaTimeline.addEffect(moveEffect);
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			mediaTimeline = timeline.getMediaTimeline(rectangle1.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			//Second rectangle add effect
			mediaTimeline = timeline.getMediaTimeline(rectangle2.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);
			
			mediaTimeline.addEffect(moveEffect);
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			mediaTimeline = timeline.getMediaTimeline(rectangle2.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());


			//First time that getMediaFrames
			mediaFramesCollection = timeline.getMediaFrames(specificTick);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(2);

			//First rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick, specificTick);

			//Second rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick, specificTick);


			//Second time that getMediaFrames
			mediaFramesCollection = timeline.getMediaFrames(specificTick2);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(2);

			//First rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick2, specificTick2);

			//Second rectangle
			mediaFrame = mediaFramesCollection[1];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificTick2, specificTick2);
		});
	});
});