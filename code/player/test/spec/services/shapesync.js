'use strict';

describe('Service: shapeSync', function () {

  // load the service's module
  beforeEach(module('animatesApp'));

  // instantiate service
  var shapeSync;
  beforeEach(inject(function (_shapeSync_) {
    shapeSync = _shapeSync_;
  }));

  it('should do something', function () {
    expect(!!shapeSync).toBe(true);
  });

});
