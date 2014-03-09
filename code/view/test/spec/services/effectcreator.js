'use strict';

describe('Service: Effectcreator', function () {

  // load the service's module
  beforeEach(module('animatesApp'));

  // instantiate service
  var Effectcreator;
  beforeEach(inject(function (_Effectcreator_) {
    Effectcreator = _Effectcreator_;
  }));

  it('should do something', function () {
    expect(!!Effectcreator).toBe(true);
  });

});
