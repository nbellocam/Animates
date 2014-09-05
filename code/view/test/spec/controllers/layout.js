'use strict';

describe('Controller: LayoutctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('animatesEditor'));

  var LayoutctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LayoutctrlCtrl = $controller('LayoutctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
