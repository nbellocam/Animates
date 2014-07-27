'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, localAnimationStateService, animationService) {
		$scope.timelines = [];
		$scope.tick = 0;

		var animationUpdateEventHandler = function animationUpdateEventHandler (target, operation) {
			if (target === 'Effect' || target === 'MediaFrame') {
				$scope.adaptMediaTimelines();
			} else if (target === 'Shape') {
				if ( operation === 'Create' || operation === 'Remove') {
					$scope.adaptMediaTimelines();
				}
			}
		};

		$scope.onTimelineTickChange = function() {
			localAnimationStateService.setCurrentTick($scope.tick);
		};

		$scope.onLocalStateTickChange = function(newVal) {
			$scope.tick = newVal;
			//TODO review if this apply is necesasary
			//$scope.$apply(function () {
			//	$scope.tick = newVal;
			//});
		};

		animationService.getInstance().addUpdateObserver('TimelinePanelCtrl', animationUpdateEventHandler);
		localAnimationStateService.addTickObserver('TimelinePanelCtrl', $scope.onLocalStateTickChange);
		animationService.getInstance().addLoadCompleteObserver('TimelinePanelCtrl', function animationLoadEventHandler () {
			$scope.adaptMediaTimelines();
		});

		$scope.adaptMediaTimelines = function adaptMediaTimelines () {
			var mediaTimelines = animationService.getInstance().timeline.getMediaTimelines();

			$scope.timelines = [];
			angular.forEach(mediaTimelines, function (mediaTimeline) {
				var timeline = {
					guid : mediaTimeline.getMediaObjectId(),
					name : mediaTimeline.getMediaObjectId(),
					events : []
				};

				angular.forEach(mediaTimeline.getEffects(), function (effect) {
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
