'use strict';

describe('Service: Timelineservice', function () {

  // load the service's module
  beforeEach(module('animatesPlayer'));

  // instantiate service
  var Timelineservice;
  beforeEach(inject(function (_Timelineservice_) {
    Timelineservice = _Timelineservice_;
  }));

  it('should do something', function () {
    expect(!!Timelineservice).toBe(true);
  });

});
