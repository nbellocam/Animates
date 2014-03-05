'use strict';

describe('Service: canvasConfig', function () {

  // load the service's module
  beforeEach(module('animatesApp'));

  // instantiate service
  var canvasConfig;
  beforeEach(inject(function (_canvasConfig_) {
    canvasConfig = _canvasConfig_;
  }));

  it('should do something', function () {
    expect(!!canvasConfig).toBe(true);
  });

});
