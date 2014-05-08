'use strict';

describe('Service: localStorageConstants', function () {

  // load the service's module
  beforeEach(module('animatesApp'));

  // instantiate service
  var localStorageConstants;
  beforeEach(inject(function (_localStorageConstants_) {
    localStorageConstants = _localStorageConstants_;
  }));

  it('should do something', function () {
    expect(!!localStorageConstants).toBe(true);
  });

});
