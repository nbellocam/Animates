'use strict';

angular.module('animatesPlayer')
	.service('playerServerService', function playerServerService($http, $window, $timeout) {

		function loadData(success, error) {
			var timeout = 100; // 10 seconds timeout
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'data.js';
			document.body.appendChild(script);

			function poll() {
			  $timeout(function () {
			    timeout--;
			    if (typeof $window.animationData !== 'undefined') {
			      success($window.animationData);
			    }
			    else if (timeout > 0) {
			      poll();
			    }
			    else {
			      error();
			    }
			  }, 100);
			}

			poll();
		}

		this.loadProject = function (id, success, error) {
			if (id === 'projectId') {
				loadData(success, error);
			} else if (id !== undefined) {
				$http.get('/api/projects/' + encodeURIComponent(id))
					.success(success)
					.error(error);
			} else {
				error();
			}
		};
	});
