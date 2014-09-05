'use strict';

describe('Directive: editable', function () {

  // load the directive's module
  beforeEach(module('animatesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should have value attribute as its value', inject(function ($compile) {
    element = angular.element('<editable value="valueText"></editable>');
    element = $compile(element)(scope);
    var input = element[0].querySelector('input'),
        span = element[0].querySelector('span');

    expect(span.text()).toBe('valueText');
    expect(input[0].value).toBe('valueText');
  }));
});
