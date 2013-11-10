/*global describe, it */

'use strict';

var Timeline = require('../../src/timeline'),
	should = require("should");

describe('Timeline', function(){
	describe('#addMediaObject', function(){

		it('Should add a new element to the timeline', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element;

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			element = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.exist(element);
		});

		it('Should add two elements', function(){
			var specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				specifiedMediaObject1 = { getGuid : function () { return specifiedMediaObjectId1; } },
				specifiedMediaObject2 = { getGuid : function () { return specifiedMediaObjectId2; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element;

			timelineElementsCount.should.be.exactly(0);

			//Object1
			timeline.addMediaObject(specifiedMediaObject1);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			element = timeline.getMediaTimeline(specifiedMediaObjectId1);
			should.exist(element);

			//Object2
			timeline.addMediaObject(specifiedMediaObject2);
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);

			element = timeline.getMediaTimeline(specifiedMediaObjectId2);
			should.exist(element);
		});

		it('Should not add undefined elements', function(){
			var specifiedMediaObject,
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(0);
		});

		it('Should not add duplicated elements', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element1,element2;

			timelineElementsCount.should.be.exactly(0);

			//Object1
			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			element1 = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.exist(element1);

			//Object1 again
			timeline.addMediaObject(specifiedMediaObject);
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			element2 = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.exist(element2);
			element2.should.be.exactly(element1);
		});

		it('Should not add duplicated elements same id but different objects', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject1 = { getGuid : function () { return specifiedMediaObjectId; } },
				specifiedMediaObject2 = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element1,element2;

			timelineElementsCount.should.be.exactly(0);

			//Object1
			timeline.addMediaObject(specifiedMediaObject1);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			element1 = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.exist(element1);

			//Object2
			timeline.addMediaObject(specifiedMediaObject2);
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			element2 = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.exist(element2);
			element2.should.be.exactly(element1);
		});
	});

	describe('#removeMediaObject', function(){
		it('Should remove an element');

		it('Should not remove a non existing element');
	});

	describe('#getMediaTimeline', function(){
		it('Should get an element');

		it('Should return undefined when trying to get a non existing element');
	});

	describe('#countMediaTimelines', function(){
	});

	describe('#clearAllElements', function(){
		it('Should remove all the elements');

		it('Should work even if there are no elements');
	});

	describe('#getElementsForFrame', function(){
	});
});
