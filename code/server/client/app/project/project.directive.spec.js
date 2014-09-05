'use strict';

describe('Directive: project', function () {

  // load the directive's module and view
  beforeEach(module('animatesApp'));
  beforeEach(module('app/project/project.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<project></project>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the project directive');
  }));
});