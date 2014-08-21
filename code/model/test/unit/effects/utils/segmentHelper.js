/*global describe, it */

'use strict';

var segmentHelper = require('../../../../src/effects/utils/segmentHelper'),
  should = require("should");

describe('segmentHelper', function() {
  describe('getSegment', function() {
    it('Should return undefined is there are not enought points (no points)', function() {
      var currentTick = 1,
        points = [],
        result = segmentHelper.getSegment(currentTick, points);

      (result === undefined).should.be.true;
    });

    it('Should return undefined is there are not enought points (only one point)', function() {
      var currentTick = 1,
        points = [{
          tick:0,
          position: {}
          }],
        result = segmentHelper.getSegment(currentTick, points);

      (result === undefined).should.be.true;
    });

    it('Should return segment if tick is in middle (only two points)', function() {
      var currentTick = 5,
        points = [{
          tick:0,
          position: {}
        },{
          tick:10,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 0);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 10);
    });

    it('Should return segment if tick is in middle (only two points reverse order)', function() {
      var currentTick = 5,
        points = [{
          tick:10,
          position: {}
        },{
          tick:0,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 0);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 10);
    });

    it('Should return segment if tick is in middle (four points and tick in first segment)', function() {
      var currentTick = 5,
        points = [{
          tick:0,
          position: {}
        },{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 0);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 10);
    });

    it('Should return segment if tick is in middle (four points and tick in second segment)', function() {
      var currentTick = 15,
        points = [{
          tick:0,
          position: {}
        },{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 10);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 20);
    });

    it('Should return segment if tick is in middle (four points, tick in second segment and points have no order)', function() {
      var currentTick = 15,
        points = [{
          tick:20,
          position: {}
        },{
          tick:0,
          position: {}
        },{
          tick:30,
          position: {}
        },{
          tick:10,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 10);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 20);
    });

    it('Should return segment if tick is in middle (four points and tick in last segment)', function() {
      var currentTick = 25,
        points = [{
          tick:0,
          position: {}
        },{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 20);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 30);
    });

    it('Should return only endPoint as current tick is before all points', function() {
      var currentTick = 5,
        points = [{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.not.have.property('startPoint');

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 10);
    });


    it('Should return segment if tick match startTick (four points and tick in first segment)', function() {
      var currentTick = 0,
        points = [{
          tick:0,
          position: {}
        },{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 0);

      result.should.have.property('endPoint');
      result.endPoint.should.have.property('tick', 10);
    });

    it('Should return only startPoint as current tick is after all points', function() {
      var currentTick = 35,
        points = [{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 30);

      result.should.not.have.property('endPoint');
    });

    it('Should return only endPoint as current tick is exactly at the last point', function() {
      var currentTick = 30,
        points = [{
          tick:10,
          position: {}
        },{
          tick:20,
          position: {}
        },{
          tick:30,
          position: {}
        }],
        result = segmentHelper.getSegment(currentTick, points);

      result.should.not.be.empty;

      result.should.have.property('startPoint');
      result.startPoint.should.have.property('tick', 30);

      result.should.not.have.property('endPoint');
    });
  });
});
