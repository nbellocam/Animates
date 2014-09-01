'use strict';

angular.module('animatesPlayer')
	.service('serverService', function serverService($http, $window, $timeout) {
		this.loadProject = function (id, success, error) {
			$http.get('./data.json')
				.success(function (data) {
					$timeout(function() {
						success(data);
					}, 600);
				})
				.error(function () {
					$http.get('/api/projects/' + encodeURIComponent(id))
						.success(success)
						.error(error);
				});
		};
	});
