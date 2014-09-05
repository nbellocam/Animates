'use strict';

angular.module('animatesEditor')
	.service('connectionService', function connectionService($window, $rootScope, $http) {
		var io = $window.io,
			_self = this,
			sockets = {};

		this.isAvailable = function () {
			return !!io;
		};

		this.addConection = function (id, url) {
			if (_self.isAvailable()) {
				sockets[id] = io.connect(url);
			}
		};

		this.on = function (id, eventName, callback) {
			if (_self.isAvailable() && sockets[id]) {
				sockets[id].on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(sockets[id], args);
					});
				});
			}
		};
		
		this.emit = function (id, eventName, data, callback) {
			if (_self.isAvailable() && sockets[id]) {
				sockets[id].emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(sockets[id], args);
						}
					});
				});
			}
		};

		this.loadProject = function (id, success, error) {
			if (_self.isAvailable()) {
				$http.get('/api/projects/' + encodeURIComponent(id))
					.success(success)
					.error(error);
			}
		};
	});