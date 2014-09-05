'use strict';

describe('Controller: EditorViewCtrl', function () {

  // load the controller's module
  beforeEach(module('animatesApp'));

  var EditorViewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorViewCtrl = $controller('EditorViewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
