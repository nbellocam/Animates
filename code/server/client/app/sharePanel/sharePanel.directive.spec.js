'use strict';

describe('Directive: sharePanel', function () {

  // load the directive's module and view
  beforeEach(module('animatesApp'));
  beforeEach(module('app/sharePanel/sharePanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<share-panel></share-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the sharePanel directive');
  }));
});