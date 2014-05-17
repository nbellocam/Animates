/*global describe, it */

'use strict';

var Animation = require('../../src/animation'),
	Rectangle = require('../../src/shapes/rectangle'),
	MoveEffect = require('../../src/effects/moveEffect'),
	Timeline = require('../../src/timeline'),
	should = require("should");


describe('Animation', function() {
	describe('Shapes operations', function() {
		it('Should call observer with Rectangle Shape creation event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				called = false;

			animation.addObserver('test', function (target, operation, params, context) {
				target.should.equal('Shape');
				operation.should.equal('Create');
				params.mediaObject.should.equal(rec);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });
			called.should.be.ok;
		});

		it('Should call observer with Rectangle Shape remove event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

			animation.addObserver('test', function (target, operation, params, context) {
				target.should.equal('Shape');
				operation.should.equal('Remove');
				params.mediaObjectId.should.equal(rec.getGuid());
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Shape', 'Remove', { 'mediaObjectId' : rec.getGuid() });
			called.should.be.ok;
		});

		it('Should call observer with Rectangle Shape update event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

			animation.addObserver('test', function (target, operation, params, context) {
				target.should.equal('Shape');
				operation.should.equal('Update');
				params.properties.should.have.property('height',200);
				params.properties.should.have.property('width',200);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Shape', 'Update', { 'mediaObjectId' : rec.getGuid(), 'properties' : { 'height' : 200, 'width' : 200 }});
			called.should.be.ok;
		});
	});

	describe('Effects operations', function() {
		it('Should call observer with MoveEffect effect creation event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				eff = new MoveEffect(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

			animation.addObserver('test', function (target, operation, params, context) {
				target.should.equal('Effect');
				operation.should.equal('Create');
				params.mediaObjectId.should.equal(rec.getGuid());
				params.effect.should.equal(eff);
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Effect', 'Create', { 'mediaObjectId' : rec.getGuid() , 'effect' : eff });
			called.should.be.ok;
		});

		it('Should call observer with MoveEffect effect remove event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				eff = new MoveEffect(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });
			animation.applyOperation('Effect', 'Create', { 'mediaObjectId' : rec.getGuid() , 'effect' : eff });

			animation.addObserver('test', function (target, operation, params, context) {
				target.should.equal('Effect');
				operation.should.equal('Remove');
				params.mediaObjectId.should.equal(rec.getGuid());
				params.effectId.should.equal(eff.getGuid());
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Effect', 'Remove', { 'mediaObjectId' : rec.getGuid() , 'effectId' : eff.getGuid() });
			called.should.be.ok;
		});

		it('Should call observer with Rectangle Shape update event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				eff = new MoveEffect(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });
			animation.applyOperation('Effect', 'Create', { 'mediaObjectId' : rec.getGuid() , 'effect' : eff });

			animation.addObserver('test', function (target, operation, params, context) {
				target.should.equal('Effect');
				operation.should.equal('Update');
				params.mediaObjectId.should.equal(rec.getGuid());
				params.effectId.should.equal(eff.getGuid());
				params.options.should.have.property('newOp', 'test');
				should.not.exist(context);
				called = true;
			});

			animation.applyOperation('Effect', 'Update', { 'mediaObjectId' : rec.getGuid() , 'effectId' : eff.getGuid(), 'options' : {'newOp' : 'test'} });
			called.should.be.ok;
		});
	});

});