'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, $rootScope, canvasService, timelineService) {
		$scope.timelines = [];
		var watches = [];

		var w = $scope.$watchCollection(function () {
				return timelineService.getMediaTimelines();
			},
			function (newVal) { //, oldVal
				angular.forEach(watches, function (watch) { watch(); });
				$scope.adaptMediaTimelines(newVal);
				angular.forEach(newVal, function (mediaTimeline){
					$scope.$watchCollection(function () {
						return mediaTimeline.getEffects();
					}, function () {
						$scope.adaptMediaTimelines(timelineService.getMediaTimelines());
					});
				});
			});

		$scope.$on('currentTickChanged', function(event, newVal) {
			timelineService.setCurrentTick(newVal);
		});

		$scope.adaptMediaTimelines = function adaptMediaTimelines (mediaTimelines){
			$scope.timelines = [];
			angular.forEach(mediaTimelines, function (mediaTimeline){
				var timeline = {
					guid : mediaTimeline.getMediaObjectId(),
					name : mediaTimeline.getMediaObjectId(),
					events : []
				};

				angular.forEach(mediaTimeline.getEffects(), function (effect){
					timeline.events.push(
						{
							name : effect.getGuid(),
							start : effect.startTick,
							duration : effect.endTick - effect.startTick
						}
					);
				});
				$scope.timelines.push(timeline);
			});
		};

		$scope.empty = function () {
			return ($scope.timelines.length === 0);
		};
	});
