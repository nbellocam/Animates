'use strict';

angular.module('animatesApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
