/*global describe, it */

'use strict';

var Timeline = require('../../src/timeline'),
	Rectangle = require('../../src/shapes/rectangle'),
	Circle = require('../../src/shapes/circle'),
	Triangle = require('../../src/shapes/triangle'),
	Text = require('../../src/text'),
	Photo = require('../../src/photo'),
	should = require("should");

describe('Performance', function() {
	describe('frames per second', function () {
		it('Should draw above 500 fps with 50 objects with no effects', function() {
			var timeline = new Timeline(),
				elementsAmount = 10,
				timelineElementsCount = 50,
				index,
				startTime,
				endTime,
				frames = 6000,
				fps;

			for (index = 0; index<elementsAmount; index++) {
				timeline.addMediaObject(new Rectangle());	
			}

			for (index = 0; index<elementsAmount; index++) {
				timeline.addMediaObject(new Triangle());	
			}

			for (index = 0; index<elementsAmount; index++) {
				timeline.addMediaObject(new Circle());	
			}

			for (index = 0; index<elementsAmount; index++) {
				timeline.addMediaObject(new Photo());	
			}

			for (index = 0; index<elementsAmount; index++) {
				timeline.addMediaObject(new Text());	
			}
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(50);
			timeline.getMediaFrames(0).should.have.lengthOf(50);

			startTime = new Date();
			for (index = 0; index < frames; index++) {
				timeline.getMediaFrames(index);
			}
			endTime = new Date();

			fps = frames / ((endTime.getTime() - startTime.getTime()) / 1000);
			fps.should.be.above(500);
		});
	});
});
