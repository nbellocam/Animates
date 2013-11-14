/*global describe, it */

'use strict';

var MoveEffect = require('../../src/effects/moveEffect'),
	Rectangle = require('../../src/shapes/rectangle'),
	Timeline = require('../../src/timeline'),
	MediaFrame = require('../../src/mediaFrame'),
	MediaTimeline = require('../../src/mediaTimeline'),
	Path = require('../../src/utils/path'),
	should = require("should");

describe('Retrive all MediaFrames for a specific frame number from the Timeline', function(){
	describe('One rectangle', function(){
		it('Should retrive the MediaFrame object related to the rectangle', function(){
			var specifiedProperties = {
					position : {
						x : 1,
						y : 2,
						z : 3
					},
					opacity: 42,
					border : {
						type : 'border',
						color : 'blue'
					},
					height: 32,
					width: 84
				},
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

			mediaFramesCollection = timeline.getElementsForFrame(specificCurrentFrameNumber);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', specifiedProperties.position.x);
			properties.position.should.have.property('y', specifiedProperties.position.y);
			properties.position.should.have.property('z', specifiedProperties.position.z);
			properties.should.have.property('opacity', specifiedProperties.opacity);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedProperties.border.type);
			properties.border.should.have.property('color', specifiedProperties.border.color);

			properties.should.have.property('height', specifiedProperties.height);
			properties.should.have.property('width', specifiedProperties.width);
		});

		it('Should retrive the MediaFrame object related to the rectangle updated with the move effect', function(){
			var specifiedProperties = {
					position : {
						x : 0,
						y : 0,
						z : 0
					},
					opacity: 42,
					border : {
						type : 'border',
						color : 'blue'
					},
					height: 32,
					width: 84
				},
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
			
			mediaTimeline.addEffect(moveEffect);
			mediaTimeline.getEffects().should.have.property(moveEffect.getGuid());

			mediaFramesCollection = timeline.getElementsForFrame(specificCurrentFrameNumber);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', specificCurrentFrameNumber);
			properties.position.should.have.property('y', specificCurrentFrameNumber);
			properties.position.should.have.property('z', specifiedProperties.position.z);
			properties.should.have.property('opacity', specifiedProperties.opacity);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedProperties.border.type);
			properties.border.should.have.property('color', specifiedProperties.border.color);

			properties.should.have.property('height', specifiedProperties.height);
			properties.should.have.property('width', specifiedProperties.width);

			mediaFramesCollection = timeline.getElementsForFrame(specificCurrentFrameNumber2);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(1);

			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', specificCurrentFrameNumber2);
			properties.position.should.have.property('y', specificCurrentFrameNumber2);
			properties.position.should.have.property('z', specifiedProperties.position.z);
			properties.should.have.property('opacity', specifiedProperties.opacity);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedProperties.border.type);
			properties.border.should.have.property('color', specifiedProperties.border.color);

			properties.should.have.property('height', specifiedProperties.height);
			properties.should.have.property('width', specifiedProperties.width);
		});

		it('Should retrive the MediaFrame objects related to the two rectangles', function(){
			var specifiedProperties = {
					position : {
						x : 1,
						y : 2,
						z : 3
					},
					opacity: 42,
					border : {
						type : 'border',
						color : 'blue'
					},
					height: 32,
					width: 84
				},
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
			mediaFramesCollection = timeline.getElementsForFrame(specificCurrentFrameNumber);
			should.exists(mediaFramesCollection);
			mediaFramesCollection.should.have.lengthOf(2);

			// First rectangle
			mediaFrame = mediaFramesCollection[0];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', specifiedProperties.position.x);
			properties.position.should.have.property('y', specifiedProperties.position.y);
			properties.position.should.have.property('z', specifiedProperties.position.z);
			properties.should.have.property('opacity', specifiedProperties.opacity);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedProperties.border.type);
			properties.border.should.have.property('color', specifiedProperties.border.color);

			properties.should.have.property('height', specifiedProperties.height);
			properties.should.have.property('width', specifiedProperties.width);

			// Second rectangle
			mediaFrame = mediaFramesCollection[1];

			should.exists(mediaFrame);
			mediaFrame.should.be.instanceOf(MediaFrame);

			properties = mediaFrame.properties();

			properties.should.have.property('position');
			properties.position.should.have.property('x', specifiedProperties.position.x);
			properties.position.should.have.property('y', specifiedProperties.position.y);
			properties.position.should.have.property('z', specifiedProperties.position.z);
			properties.should.have.property('opacity', specifiedProperties.opacity);
			properties.should.have.property('border');
			properties.border.should.have.property('type', specifiedProperties.border.type);
			properties.border.should.have.property('color', specifiedProperties.border.color);

			properties.should.have.property('height', specifiedProperties.height);
			properties.should.have.property('width', specifiedProperties.width);
		});
	});
});