'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, localAnimationStateService, animationService, presentationPlayerService) {
		$scope.timelines = [];
		$scope.tick = 0;
		$scope.disable = false;
		$scope.tickRatio = presentationPlayerService.tickDuration();

		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.disable = !animationService.isEditingEnable;
			});

		var animationUpdateEventHandler = function animationUpdateEventHandler() {
			$scope.adaptMediaTimelines();
		};

		$scope.onTimelineTickChange = function(tick) {
			localAnimationStateService.setCurrentTick(tick);
		};

		$scope.onLocalStateTickChange = function(newVal) {
			if ($scope.tick !== newVal) {
				$scope.tick = newVal;

				if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
					$scope.$apply();
				}
			}
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
						data : { id: mediaTimeline.getMediaObjectId() },
						name : mediaTimeline.getMediaObjectName(),
						lines : []
					},
					events = [],
					effectPoints, points;

				angular.forEach(mediaTimeline.getEffects(), function (effect) {
					var pointTick;

					if (effect.isInfinite()) {
						effectPoints = effect.getOption('points');
						points = [];

						for (var guid in effectPoints) {
							pointTick = effectPoints[guid].tick;
							if ( pointTick !== 0) {
								points.push({
									data : { id: guid },
									tick: pointTick
								});
							}
						}

						timeline.lines.push({
							name : effect.getGuid(),
							data : { id: effect.getGuid() },
							points : points
						});
					} else {
						events.push({
							name : effect.getGuid(),
							data : { id: effect.getGuid() },
							start : effect.getOption('startTick'),
							duration : effect.getOption('endTick') - effect.getOption('startTick')
						});
					}
				});

				if (events.length > 0) {
					timeline.lines.push({ events : events});
				}

				$scope.timelines.push(timeline);
			});
		};

		$scope.empty = function () {
			return ($scope.timelines.length === 0);
		};
	});
