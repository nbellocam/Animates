'use strict';

angular.module('animatesApp')
	.factory('connectionService', function connectionService($window, $rootScope) {
		var io = $window.io,
			sockets = {},
			isAvailable = function isAvailable () { return !!io; };

		return {
			isAvailable: isAvailable,
			addConection: function (id, url){
				if (isAvailable()){
					sockets[id] = io.connect(url);
				}
			},
			on: function (id, eventName, callback) {
				if (isAvailable() && sockets[id]){
					sockets[id].on(eventName, function () {
						var args = arguments;
						$rootScope.$apply(function () {
							callback.apply(sockets[id], args);
						});
					});
				}

			},
			emit: function (id, eventName, data, callback) {
				if (isAvailable() && sockets[id]){
					sockets[id].emit(eventName, data, function () {
						var args = arguments;
						$rootScope.$apply(function () {
							if (callback) {
								callback.apply(sockets[id], args);
							}
						});
					});
				}
			}
		};
	});