'use strict';

//Project service used for articles REST endpoint
angular.module('animatesApp').factory('ProjectService', ['$resource', function($resource) {
	return $resource('api/projects/:projectId', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
}]);