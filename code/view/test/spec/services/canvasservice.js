'use strict';

describe('Service: Canvasservice', function () {

  // load the service's module
  beforeEach(module('animatesEditor'));

  // instantiate service
  var Canvasservice;
  beforeEach(inject(function (_Canvasservice_) {
    Canvasservice = _Canvasservice_;
  }));

  it('should do something', function () {
    expect(!!Canvasservice).toBe(true);
  });

});
