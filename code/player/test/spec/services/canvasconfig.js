'use strict';

describe('Service: playerCanvasConfig', function () {

  // load the service's module
  beforeEach(module('animatesPlayer'));

  // instantiate service
  var playerCanvasConfig;
  beforeEach(inject(function (_playerCanvasConfig_) {
    playerCanvasConfig = _playerCanvasConfig_;
  }));

  it('should do something', function () {
    expect(!!playerCanvasConfig).toBe(true);
  });

});
