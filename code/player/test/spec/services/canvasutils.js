'use strict';

describe('Service: canvasUtils', function () {

  // load the service's module
  beforeEach(module('animatesPlayer'));

  // instantiate service
  var canvasUtils;
  beforeEach(inject(function (_canvasUtils_) {
    canvasUtils = _canvasUtils_;
  }));

  it('should do something', function () {
    expect(!!canvasUtils).toBe(true);
  });

});
