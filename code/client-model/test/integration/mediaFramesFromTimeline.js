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
			opacity: 42,
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
	}
};

describe('Retrive all MediaFrames for a specific frame number from the Timeline', function(){
	describe('One rectangle', function(){
		it('Should retrive the MediaFrame object related to the rectangle', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificCurrentFrameNumber = 42,
				mediaTimeline,
				mediaFramesCollection,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle);

			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			utils.testMediaFrameProperties(properties, specifiedProperties, specifiedProperties.position.x, specifiedProperties.position.y);
		});

		it('Should retrive the MediaFrame object related to the rectangle updated with the move effect', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificCurrentFrameNumber = 42,
				specificCurrentFrameNumber2 = specificCurrentFrameNumber / 2,
				specifiedEndPosition = { x: specificCurrentFrameNumber, y: specificCurrentFrameNumber },
				specifiedPath = new Path({ endPosition : specifiedEndPosition }),
				moveEffect = new MoveEffect({ path: specifiedPath }),
				mediaTimeline,
				mediaFramesCollection,
				mediaFrame,
				properties;

			timeline.addMediaObject(rectangle);

			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);

			// Add effects
			mediaTimeline.addEffect(moveEffect);
			
			// Basic effect test
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			// mediaFrameCollection for time "specificCurrentFrameNumber"
			mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber, specificCurrentFrameNumber);

			// mediaFrameCollection for time "specificCurrentFrameNumber2"
			mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber2);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber2, specificCurrentFrameNumber2);

			// mediaFrameCollection for time "0"
			mediaFramesCollection = timeline.getElements(0);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			utils.testMediaFrameProperties(properties, specifiedProperties, specifiedProperties.position.x, specifiedProperties.position.y);
		});

		//it('Should retrive the MediaFrame object related to the rectangle updated with two continuous move effects', function(){
		//	var specifiedProperties = utils.createSpecifiedProperties(),
		//		rectangle = new Rectangle(specifiedProperties),
		//		timeline = new Timeline(),
		//		specificCurrentFrameNumber = 42,
		//		specificCurrentFrameNumber2 = specificCurrentFrameNumber / 2,
		//		specifiedEndPosition = { x: specificCurrentFrameNumber, y: specificCurrentFrameNumber },
		//		specifiedPath = new Path({ endPosition : specifiedEndPosition }),
		//		moveEffect = new MoveEffect({ path: specifiedPath }),
		//		specifiedPath2 = new Path({ startPosition : specifiedEndPosition }),
		//		moveEffect2 = new MoveEffect({ startTick: specificCurrentFrameNumber, path: specifiedPath2 }),
		//		mediaTimeline,
		//		mediaFramesCollection,
		//		mediaFrame,
		//		properties,
		//		effects;

		//	timeline.addMediaObject(rectangle);

		//	mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
		//	should.exists(mediaTimeline);
		//	mediaTimeline.should.be.instanceOf(MediaTimeline);
			
		//	//Add effects
		//	mediaTimeline.addEffect(moveEffect);
		//	mediaTimeline.addEffect(moveEffect2);


		//	//Basic effect test
		//	effects = mediaTimeline.getEffects();
		//	effects.should.have.property(moveEffect.getGuid());
		//	effects.should.have.property(moveEffect2.getGuid());

		//	mediaTimeline = timeline.getMediaTimeline(rectangle.getGuid());
		//	effects = mediaTimeline.getEffects();
		//	effects.should.have.property(moveEffect.getGuid());
		//	effects.should.have.property(moveEffect2.getGuid());

		//	//mediaFrameCollection for time "specificCurrentFrameNumber"
		//	mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber);
		//	should.exists(mediaFramesCollection);
		//	mediaFramesCollection.should.have.lengthOf(1);

		//	mediaFrame = mediaFramesCollection[0];

		//	should.exists(mediaFrame);
		//	mediaFrame.should.be.instanceOf(MediaFrame);

		//	properties = mediaFrame.properties();

		//	utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber, specificCurrentFrameNumber);

		//	//mediaFrameCollection for time "specificCurrentFrameNumber2"
		//	mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber2);
		//	should.exists(mediaFramesCollection);
		//	mediaFramesCollection.should.have.lengthOf(1);

		//	mediaFrame = mediaFramesCollection[0];

		//	should.exists(mediaFrame);
		//	mediaFrame.should.be.instanceOf(MediaFrame);

		//	properties = mediaFrame.properties();

		//	utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber2, specificCurrentFrameNumber2);

		//	//mediaFrameCollection for time "0"
		//	mediaFramesCollection = timeline.getElements(0);
		//	should.exists(mediaFramesCollection);
		//	mediaFramesCollection.should.have.lengthOf(1);

		//	mediaFrame = mediaFramesCollection[0];

		//	should.exists(mediaFrame);
		//	mediaFrame.should.be.instanceOf(MediaFrame);

		//	properties = mediaFrame.properties();

		//	utils.testMediaFrameProperties(properties, specifiedProperties, 0, 0);

		//	//mediaFrameCollection for time "specificCurrentFrameNumber2 + specificCurrentFrameNumber"
		//	mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber2 + specificCurrentFrameNumber);
		//	should.exists(mediaFramesCollection);
		//	mediaFramesCollection.should.have.lengthOf(1);

		//	mediaFrame = mediaFramesCollection[0];

		//	should.exists(mediaFrame);
		//	mediaFrame.should.be.instanceOf(MediaFrame);

		//	properties = mediaFrame.properties();

		//	utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber2, specificCurrentFrameNumber2);

		//	//mediaFrameCollection for time "specificCurrentFrameNumber * 2"
		//	mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber * 2);
		//	should.exists(mediaFramesCollection);
		//	mediaFramesCollection.should.have.lengthOf(1);

		//	mediaFrame = mediaFramesCollection[0];

		//	should.exists(mediaFrame);
		//	mediaFrame.should.be.instanceOf(MediaFrame);

		//	properties = mediaFrame.properties();

		//	utils.testMediaFrameProperties(properties, specifiedProperties, 0, 0);

		//	//mediaFrameCollection for time "specificCurrentFrameNumber * 3"
		//	mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber * 4);
		//	should.exists(mediaFramesCollection);
		//	mediaFramesCollection.should.have.lengthOf(1);

		//	mediaFrame = mediaFramesCollection[0];

		//	should.exists(mediaFrame);
		//	mediaFrame.should.be.instanceOf(MediaFrame);

		//	properties = mediaFrame.properties();

		//	utils.testMediaFrameProperties(properties, specifiedProperties, 0, 0);
			
		//});

		it('Should retrive the MediaFrame objects related to the two rectangles', function(){
			var specifiedProperties = utils.createSpecifiedProperties(),
				rectangle1 = new Rectangle(specifiedProperties),
				rectangle2 = new Rectangle(specifiedProperties),
				timeline = new Timeline(),
				specificCurrentFrameNumber = 42,
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
			mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber);
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
				specificCurrentFrameNumber = 42,
				specificCurrentFrameNumber2 = specificCurrentFrameNumber / 2,
				specifiedEndPosition = { x: specificCurrentFrameNumber, y: specificCurrentFrameNumber },
				specifiedPath = new Path({ endPosition : specifiedEndPosition }),
				moveEffect = new MoveEffect({ path: specifiedPath }),
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
			mediaTimeline = timeline.getMediaTimeline(rectangle1.getGuid());
			should.exists(mediaTimeline);
			mediaTimeline.should.be.instanceOf(MediaTimeline);
			
			mediaTimeline.addEffect(moveEffect);
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			mediaTimeline = timeline.getMediaTimeline(rectangle1.getGuid());
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());


			//First time that getElements
			mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(2);

			// First rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber, specificCurrentFrameNumber);

			// Second rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber, specificCurrentFrameNumber);


			//Second time that getElements
			mediaFramesCollection = timeline.getElements(specificCurrentFrameNumber2);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(2);

			// First rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber2, specificCurrentFrameNumber2);

			// Second rectangle
			mediaFrame = mediaFramesCollection[1];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();
			utils.testMediaFrameProperties(properties, specifiedProperties, specificCurrentFrameNumber2, specificCurrentFrameNumber2);
		});
	});
});