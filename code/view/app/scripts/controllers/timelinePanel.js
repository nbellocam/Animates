'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, $rootScope, $location, canvasService, timelineService) {
		$scope.timelineService = timelineService;

		$scope.timelines = [];
		
		$scope.$watchCollection('timelineService.getMediaTimelines()', function (newVal) { //, oldVal
			$scope.adaptMediaTimelines(newVal);
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
							start : effect.getStartTick(),
							duration : effect.getEndTick() - effect.getStartTick()
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
