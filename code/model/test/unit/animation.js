/*global describe, it */

'use strict';

var Animation = require('../../src/animation'),
	Rectangle = require('../../src/shapes/rectangle'),
	Effect = require('../../src/finiteEffect'),
	MoveEffect = require('../../src/effects/moveEffect'),
	Timeline = require('../../src/timeline'),
	Canvas = require('../../src/canvas'),
	should = require("should");


describe('Animation', function() {
	describe('Shapes operations', function() {
		it('Should call observer with Rectangle Shape creation event', function() {
			var timeline = new Timeline(),
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				rec = new Rectangle(),
				called = false;

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				target.should.equal('Shape');
				operation.should.equal('Create');
				params.mediaObject.should.equal(rec);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec , 'tick' : 100});
			called.should.be.ok;

			timeline.countMediaTimelines().should.be.equal(1);

			var mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);
			mediaTimeline.getStartTick().should.be.equal(100);
			mediaTimeline.getEndTick().should.be.equal(-1);
		});

		it('Should call observer with Rectangle Shape remove event', function() {
			var timeline = new Timeline(),
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				rec = new Rectangle(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

			timeline.countMediaTimelines().should.be.equal(1);
			var mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				target.should.equal('Shape');
				operation.should.equal('Remove');
				params.mediaObjectId.should.equal(rec.getGuid());
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Shape', 'Remove', { 'mediaObjectId' : rec.getGuid() });
			called.should.be.ok;

			timeline.countMediaTimelines().should.be.equal(0);

			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.not.exist(mediaTimeline);
		});

		it('Should call observer with Rectangle Shape update event', function() {
			var timeline = new Timeline(),
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				rec = new Rectangle(),
				called = false,
				mediaTimeline = null,
				objectPorperties = null;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

			timeline.countMediaTimelines().should.be.equal(1);
			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				target.should.equal('Shape');
				operation.should.equal('Update');
				params.properties.should.have.property('height',200);
				params.properties.should.have.property('width',200);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Shape', 'Update', { 'mediaObjectId' : rec.getGuid(), 'properties' : { 'height' : 200, 'width' : 200 }});
			called.should.be.ok;

			timeline.countMediaTimelines().should.be.equal(1);
			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);
			mediaTimeline.getMediaObject().getGuid().should.equal(rec.getGuid());
			objectPorperties = mediaTimeline.getMediaObject().getProperties();
			objectPorperties.should.have.property('height', 200);
			objectPorperties.should.have.property('width', 200);
		});
	});

	describe('Effects operations', function() {
		it('Should call observer with MoveEffect effect creation event', function() {
			var timeline = new Timeline(),
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				rec = new Rectangle(),
				eff = new MoveEffect(),
				called = false,
				mediaTimeline = null,
				effectOptions = null;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				target.should.equal('Effect');
				operation.should.equal('Create');
				params.mediaObjectId.should.equal(rec.getGuid());
				params.effect.should.equal(eff);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Effect', 'Create', { 'mediaObjectId' : rec.getGuid() , 'effect' : eff });
			called.should.be.ok;

			timeline.countMediaTimelines().should.be.equal(1);
			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);
			should.exist(mediaTimeline.getEffect(eff.getGuid()));
		});

		it('Should call observer with MoveEffect effect remove event', function() {
			var timeline = new Timeline(),
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				rec = new Rectangle(),
				eff = new MoveEffect(),
				called = false,
				mediaTimeline = null,
				effectOptions = null;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });
			animation.applyOperation('Effect', 'Create', { 'mediaObjectId' : rec.getGuid() , 'effect' : eff });

			timeline.countMediaTimelines().should.be.equal(1);
			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);
			should.exist(mediaTimeline.getEffect(eff.getGuid()));

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				target.should.equal('Effect');
				operation.should.equal('Remove');
				params.mediaObjectId.should.equal(rec.getGuid());
				params.effectId.should.equal(eff.getGuid());
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Effect', 'Remove', { 'mediaObjectId' : rec.getGuid() , 'effectId' : eff.getGuid() });
			called.should.be.ok;

			timeline.countMediaTimelines().should.be.equal(1);
			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);
			should.not.exist(mediaTimeline.getEffect(eff.getGuid()));
		});

		it('Should call observer with Rectangle Shape update event', function() {
			var timeline = new Timeline(),
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				rec = new Rectangle(),
				eff = new MoveEffect(),
				called = false,
				mediaTimeline = null,
				effectOptions = null;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });
			animation.applyOperation('Effect', 'Create', { 'mediaObjectId' : rec.getGuid() , 'effect' : eff });

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				target.should.equal('Effect');
				operation.should.equal('Update');
				params.mediaObjectId.should.equal(rec.getGuid());
				params.effectId.should.equal(eff.getGuid());
				params.options.should.have.property('startTick', 100);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Effect', 'Update', { 'mediaObjectId' : rec.getGuid() , 'effectId' : eff.getGuid(), 'options' : {'startTick' :100} });
			called.should.be.ok;

			timeline.countMediaTimelines().should.be.equal(1);
			mediaTimeline = timeline.getMediaTimeline(rec.getGuid());
			should.exist(mediaTimeline);
			should.exist(mediaTimeline.getEffect(eff.getGuid()));
			effectOptions = mediaTimeline.getEffect(eff.getGuid()).getOptions();
			effectOptions.should.have.property('startTick', 100);
		});
	});

	describe('MediaFrames operations', function() {
		it('Should call observer with MediaFrame update event', function() {
			var targetMediaObjectId = "targetId",
				targetTick = 42,
				targetUpdatedProperties = {
					key1 : 'value1',
					key2 : 'value2',
					key3 : 'value3'
				},
				updatedTargetUpdatedPropertiesKeys = ['key2'],
				getMediaTimelineCalled = false,
				updateEffectsThatMatchCalled = false,
				getMediaObjectCalled = false,
				setPropertiesCalled = false,
				mediaObject = {
					setProperties : function (notUpdatedProperties) {
						setPropertiesCalled.should.not.be.ok;
						setPropertiesCalled = true;
						notUpdatedProperties.should.not.have.property('key1');
						notUpdatedProperties.should.have.property('key2', 'value2');
						notUpdatedProperties.should.not.have.property('key3');
					}
				},
				mediatimeline = {
					updateEffectsThatMatch : function (tick, updatedProperties) {
						updateEffectsThatMatchCalled.should.not.be.ok;
						updateEffectsThatMatchCalled = true;
						tick.should.be.equal(targetTick);
						updatedProperties.should.be.equal(targetUpdatedProperties);
						return { pendingProperties : updatedTargetUpdatedPropertiesKeys };
					},
					getMediaObject : function () {
						getMediaObjectCalled = true;
						return mediaObject;
					}
				},
				timeline = {
					getMediaTimeline : function(mediaObjectId) {
						getMediaTimelineCalled.should.not.be.ok;
						getMediaTimelineCalled = true;
						mediaObjectId.should.be.equal(targetMediaObjectId);
						return mediatimeline;
					}
				},
				canvas = new Canvas(),
				animation = new Animation({ timeline : timeline, canvas : canvas}),
				observerCalled = false;

			animation.addUpdateObserver('test', function (target, operation, params, context) {
				observerCalled.should.not.be.ok;
				observerCalled = true;
				target.should.equal('MediaFrame');
				operation.should.equal('Update');
				params.should.have.property('mediaObjectId', targetMediaObjectId);
				params.should.have.property('updatedProperties');
				params.updatedProperties.should.have.properties('key1', 'key2', 'key3');
				params.updatedProperties.should.equal(targetUpdatedProperties);
				params.should.have.property('tick', targetTick);
				should.not.exist(context);
			});

			animation.applyOperation('MediaFrame', 'Update', {
				'mediaObjectId' : targetMediaObjectId,
				'updatedProperties' : targetUpdatedProperties,
				'tick' : targetTick
				});

			getMediaTimelineCalled.should.be.ok;
			updateEffectsThatMatchCalled.should.be.ok;
			getMediaObjectCalled.should.be.ok;
			setPropertiesCalled.should.be.ok;
			observerCalled.should.be.ok;
		});
	});

	describe('Serialization', function() {
		it('toJson should return json', function() {
			var animation = new Animation(),
				json = animation.toJSON();

			json.should.have.property('canvas');
			json.canvas.type.should.equal('Canvas');
			json.should.have.property('timeline');
			json.timeline.type.should.equal('Timeline');
		});
	});
});
