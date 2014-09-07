'use strict';

describe('Controller: PlayerViewCtrl', function () {

  // load the controller's module
  beforeEach(module('animatesApp'));

  var PlayerViewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayerViewCtrl = $controller('PlayerViewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
