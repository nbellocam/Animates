/*global describe, it */

'use strict';

var Animation = require('../../src/animation'),
	Rectangle = require('../../src/shapes/rectangle'),
	Timeline = require('../../src/timeline'),
	should = require("should");

describe('Animation', function() {
	describe('Shapes operations', function() {
		it('Should call observer with Rectangle Shape creation event', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				called = false;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec });

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
});