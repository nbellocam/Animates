'use strict';

describe('Service: playerShapeSync', function () {

  // load the service's module
  beforeEach(module('animatesPlayer'));

  // instantiate service
  var playerShapeSync;
  beforeEach(inject(function (_playerShapeSync_) {
    playerShapeSync = _playerShapeSync_;
  }));

  it('should do something', function () {
    expect(!!playerShapeSync).toBe(true);
  });

});
