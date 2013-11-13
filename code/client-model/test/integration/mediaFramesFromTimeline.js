/*global describe, it */

'use strict';

var MoveEffect = require('../../src/effects/moveEffect'),
	Rectangle = require('../../src/shapes/rectangle'),
	Timeline = require('../../src/timeline'),
	MediaFrame = require('../../src/mediaFrame'),
	MediaTimeline = require('../../src/mediaTimeline'),
	should = require("should");

describe('Retrive all MediaFrames for a specific frame number from the Timeline', function(){
	describe('One rectangle', function(){
		it('Should retrive the MediaFrame object related to the rectangle', function(){
			var rectangle = new Rectangle(),
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
			properties.position.should.have.property('x',0);
			properties.position.should.have.property('y',0);
			properties.position.should.have.property('z',0);
			properties.should.have.property('opacity',1);
			properties.should.have.property('border');
			properties.border.should.have.property('type','none');
			properties.border.should.have.property('color','black');

			properties.should.have.property('height', 100);
			properties.should.have.property('width', 100);
		});
	});
});