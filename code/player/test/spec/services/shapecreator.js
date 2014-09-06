'use strict';

describe('Service: playerShapeCreator', function () {

  // load the service's module
  beforeEach(module('animatesPlayer'));

  // instantiate service
  var playerShapeCreator;
  beforeEach(inject(function (_playerShapeCreator_) {
    playerShapeCreator = _playerShapeCreator_;
  }));

  it('should do something', function () {
    expect(!!playerShapeCreator).toBe(true);
  });

});
