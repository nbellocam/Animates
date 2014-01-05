'use strict';

describe('Service: currentCanvas', function () {

  // load the service's module
  beforeEach(module('animatesApp'));

  // instantiate service
  var currentCanvas;
  beforeEach(inject(function (_currentCanvas_) {
    currentCanvas = _currentCanvas_;
  }));

  it('should do something', function () {
    expect(!!currentCanvas).toBe(true);
  });

});
