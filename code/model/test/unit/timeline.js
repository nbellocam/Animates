/*global describe, it */

'use strict';

var Timeline = require('../../src/timeline'),
	should = require("should");

describe('Timeline', function(){
	describe('*addMediaObject', function(){

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

		it('Should add two elements.', function(){
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

		it('Should not add undefined elements.', function(){
			var specifiedMediaObject,
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(0);
		});

		it('Should not add duplicated elements.', function(){
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

		it('Should not add duplicated elements same id but different objects.', function(){
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

	describe('*removeMediaObject', function(){
		it('Should remove the only existing element', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element;

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			timeline.removeMediaObject(specifiedMediaObjectId);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(0);

			element = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.not.exist(element);
		});

		it('Should not remove a non existing element.', function(){
			var specifiedMediaObjectIdToRemove = '12',
				specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element;

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			timeline.removeMediaObject(specifiedMediaObjectIdToRemove);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);
		});

		it('Should remove an element (the first) when another exist.', function(){
			var specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				specifiedMediaObject1 = { getGuid : function () { return specifiedMediaObjectId1; } },
				specifiedMediaObject2 = { getGuid : function () { return specifiedMediaObjectId2; } },
				timeline = new Timeline(),
				timelineElementsCount;

			timeline.addMediaObject(specifiedMediaObject1);
			timeline.addMediaObject(specifiedMediaObject2);
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);

			timeline.removeMediaObject(specifiedMediaObjectId1);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);
		});

		it('Should remove an element (the last) when another exist.', function(){
			var specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				specifiedMediaObject1 = { getGuid : function () { return specifiedMediaObjectId1; } },
				specifiedMediaObject2 = { getGuid : function () { return specifiedMediaObjectId2; } },
				timeline = new Timeline(),
				timelineElementsCount;

			timeline.addMediaObject(specifiedMediaObject1);
			timeline.addMediaObject(specifiedMediaObject2);
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);

			timeline.removeMediaObject(specifiedMediaObjectId2);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);
		});
	});

	describe('*getMediaTimeline', function(){
		it('Should get an element.', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element,
				mediaObjectId;

			timeline.addMediaObject(specifiedMediaObject);

			element = timeline.getMediaTimeline(specifiedMediaObjectId);
			should.exist(element);
			
			mediaObjectId = element.getMediaObjectId();
			mediaObjectId.should.be.exactly(specifiedMediaObjectId);
		});

		it('Should return undefined when trying to get a non existing element.', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObjectIdToFind = '12',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				element,
				mediaObjectId;

			timeline.addMediaObject(specifiedMediaObject);

			element = timeline.getMediaTimeline(specifiedMediaObjectIdToFind);
			should.not.exist(element);
		});
	});

	describe('#countMediaTimelines', function(){
		it('Should count only one element at the timeline.', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);
		});

		it('Should count two elements at the timeline.', function(){
			var specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				specifiedMediaObject1 = { getGuid : function () { return specifiedMediaObjectId1; } },
				specifiedMediaObject2 = { getGuid : function () { return specifiedMediaObjectId2; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject1);
			timeline.addMediaObject(specifiedMediaObject2);
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);
		});

		it('Should not count any elements at the timeline.', function(){
			var specifiedMediaObject,
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);
		});

		it('Should not count any elements at the timeline if the element is removed.', function(){
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { getGuid : function () { return specifiedMediaObjectId; } },
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);

			timeline.addMediaObject(specifiedMediaObject);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			timeline.removeMediaObject(specifiedMediaObjectId);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(0);
		});
	});

	describe('*clearAllElements', function(){
		it('Should remove all the elements.', function(){
			var specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				specifiedMediaObject1 = { getGuid : function () { return specifiedMediaObjectId1; } },
				specifiedMediaObject2 = { getGuid : function () { return specifiedMediaObjectId2; } },
				timeline = new Timeline(),
				timelineElementsCount;

			timeline.addMediaObject(specifiedMediaObject1);
			timeline.addMediaObject(specifiedMediaObject2);
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);

			timeline.clearAllElements();
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(0);
		});

		it('Should work even if there are no elements.', function(){
			var timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines();

			timelineElementsCount.should.be.exactly(0);

			timeline.clearAllElements();
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(0);
		});
	});

	describe('getElements()', function(){
		it('Should return an empty array if no elements are present in the timeline.', function(){
			var specifiedFrameNumber = 42,
				timeline = new Timeline(),
				timelineElementsCount = timeline.countMediaTimelines(),
				result;

			timelineElementsCount.should.be.exactly(0);

			result = timeline.getElements(specifiedFrameNumber);
			result.should.be.empty;
		});

		it('Should return two elements if timeline contains two media objects.', function(){
			var specifiedFrameNumber = 42,
				specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				defaultProperties = { },
				specifiedMediaObject1 = { 
					getGuid : function () { return specifiedMediaObjectId1; },
					getProperties : function () { return defaultProperties; }
				},
				specifiedMediaObject2 = { 
					getGuid : function () { return specifiedMediaObjectId2; }, 
					getProperties : function () { return defaultProperties; }
				},
				timeline = new Timeline(),
				timelineElementsCount,
				result;

			timeline.addMediaObject(specifiedMediaObject1);
			timeline.addMediaObject(specifiedMediaObject2);
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);

			result = timeline.getElements(specifiedFrameNumber);
			result.should.have.lengthOf(2);
		});

		it('Should return one elements if timeline contains one media objects after removing another.', function(){
			var specifiedFrameNumber = 42,
				specifiedMediaObjectId1 = '42',
				specifiedMediaObjectId2 = '82',
				defaultProperties = { },
				specifiedMediaObject1 = { 
					getGuid : function () { return specifiedMediaObjectId1; },
					getProperties : function () { return defaultProperties; }
				},
				specifiedMediaObject2 = { 
					getGuid : function () { return specifiedMediaObjectId2; }, 
					getProperties : function () { return defaultProperties; }
				},
				timeline = new Timeline(),
				timelineElementsCount,
				result;

			timeline.addMediaObject(specifiedMediaObject1);
			timeline.addMediaObject(specifiedMediaObject2);
			
			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(2);

			timeline.removeMediaObject(specifiedMediaObjectId1);

			timelineElementsCount = timeline.countMediaTimelines();
			timelineElementsCount.should.be.exactly(1);

			result = timeline.getElements(specifiedFrameNumber);
			result.should.have.lengthOf(1);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var timeline = new Timeline(),
				json = null,
				dummyMediaObject = { 
					getGuid : function () { return 'ID'; }, 
					toJSON : function () { return ''; }
				};
			timeline.addMediaObject(dummyMediaObject);

			json = timeline.toJSON();

			json.should.have.property('mediaTimelines');
			json.mediaTimelines.should.have.lengthOf(1);
		});
	});	
});
