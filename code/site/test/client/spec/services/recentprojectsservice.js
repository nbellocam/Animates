'use strict';

describe('Service: recentProjectsService', function () {

  // load the service's module
  beforeEach(module('animatesApp'));

  // instantiate service
  var recentProjectsService;
  beforeEach(inject(function (_recentProjectsService_) {
    recentProjectsService = _recentProjectsService_;
  }));

  it('should do something', function () {
    expect(!!recentProjectsService).toBe(true);
  });

});
