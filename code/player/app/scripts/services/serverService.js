'use strict';

angular.module('animatesApp')
	.service('serverService', function serverService($http) {
		this.loadProject = function (id, success, error) {
			$http.get('/api/projects/' + encodeURIComponent(id))
				.success(success)
				.error(error);
		};

		this.isAvailable = function () {
			return false;
		};
	});
