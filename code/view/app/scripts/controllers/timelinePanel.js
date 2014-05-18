'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, timelineService, animationService) {
		$scope.timelines = [];

		var modelEventHandler = function modelEventHandler (target, operation) {
			if (target === 'Effect') {
				$scope.adaptMediaTimelines(timelineService.getMediaTimelines());
			} else if (target === 'Shape') {
				if ( operation === 'Create' || operation === 'Remove'){
					$scope.adaptMediaTimelines(timelineService.getMediaTimelines());
				}
			}
		};

		animationService.getInstance().addObserver('TimelinePanelCtrl', modelEventHandler);

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
					timeline.events.push({
						name : effect.getGuid(),
						start : effect.getOption('startTick'),
						duration : effect.getOption('endTick') - effect.getOption('startTick')
					});
				});

				$scope.timelines.push(timeline);
			});
		};

		$scope.empty = function () {
			return ($scope.timelines.length === 0);
		};
	});
