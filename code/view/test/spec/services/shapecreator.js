'use strict';

describe('Service: shapeCreator', function () {

  // load the service's module
  beforeEach(module('animatesEditor'));

  // instantiate service
  var shapeCreator;
  beforeEach(inject(function (_shapeCreator_) {
    shapeCreator = _shapeCreator_;
  }));

  it('should do something', function () {
    expect(!!shapeCreator).toBe(true);
  });

});
