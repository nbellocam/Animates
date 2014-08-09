'use strict';

angular.module('animatesApp')
	.controller('TimelinePanelCtrl', function($scope, localAnimationStateService, animationService) {
		$scope.timelines = [];
		$scope.tick = 0;
		$scope.disable = false;

		$scope.$watch(function() {
				return animationService.isEditingEnable;
			}, function() {
				$scope.disable = !animationService.isEditingEnable;
			});

		var animationUpdateEventHandler = function animationUpdateEventHandler (target, operation) {
			if (target === 'Effect' || target === 'MediaFrame') {
				$scope.adaptMediaTimelines();
			} else if (target === 'Shape') {
				if ( operation === 'Create' || operation === 'Remove') {
					$scope.adaptMediaTimelines();
				}
			}
		};

		$scope.onTimelineTickChange = function(tick) {
			localAnimationStateService.setCurrentTick(tick);
		};

		$scope.onLocalStateTickChange = function(newVal) {
			if ($scope.tick !== newVal) {
				$scope.tick = newVal;
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
						name : mediaTimeline.getMediaObjectId(),
						lines : []
					},
					events = [],
					effectPoints, points;

				angular.forEach(mediaTimeline.getEffects(), function (effect) {
					if (effect.isInfinite()) {
						effectPoints = effect.getOption('points');
						points = [];

						for (var guid in effectPoints) {
							points.push({
								data : { id: mediaTimeline.getMediaObjectId() },
								tick: effectPoints[guid].tick
							});
						}

						timeline.lines.push({
							name : effect.getGuid(),
							data : { id: mediaTimeline.getMediaObjectId() },
							points : points
						});
					} else {
						events.push({
							name : effect.getGuid(),
							data : { id: mediaTimeline.getMediaObjectId() },
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

		$scope.onPointMove = function (timelineData, pointData, newTick) {
			console.log('onPointMove');
			console.log(timelineData);
			console.log(pointData);
			console.log(newTick);
			console.log('------');
		};

		$scope.onPointClick = function (timelineData, pointData) {
			console.log('onPointClick');
			console.log(timelineData);
			console.log(pointData);
			console.log('------');
		};

		$scope.onMultiplePointEventSelected = function (timelineData, eventData) {
			console.log('onMultiplePointEventSelected');
			console.log(timelineData);
			console.log(eventData);
			console.log('------');
		};

		$scope.onEventStartChange = function (timelineData, eventData, newStartTick) {
			console.log('onEventStartChange');
			console.log(timelineData);
			console.log(eventData);
			console.log(newStartTick);
			console.log('------');
		};

		$scope.onEventDurationChange = function (timelineData, eventData, newDuration) {
			console.log('onEventDurationChange');
			console.log(timelineData);
			console.log(eventData);
			console.log(newDuration);
			console.log('------');
		};

		$scope.onEventClick = function (timelineData, eventData){
			console.log('onEventClick');
			console.log(timelineData);
			console.log(eventData);
			console.log('------');
		};
	});
