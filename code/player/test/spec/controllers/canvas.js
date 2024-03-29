'use strict';

describe('Controller: CanvasCtrl', function () {

  // load the controller's module
  beforeEach(module('animatesPlayer'));

  var CanvasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CanvasCtrl = $controller('CanvasCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
