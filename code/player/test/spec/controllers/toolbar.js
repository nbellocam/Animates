'use strict';

describe('Controller: ToolbarCtrl', function () {

  // load the controller's module
  beforeEach(module('animatesPlayer'));

  var ToolbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ToolbarCtrl = $controller('ToolbarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
