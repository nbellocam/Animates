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

		var applyEffectUpdateOperation = function applyEffectUpdateOperation(mediaObjectId, effectId, updatedOptions) {
			animationService.getInstance().applyOperation('Effect', 'Update', {
				mediaObjectId :  mediaObjectId,
				effectId : effectId,
				options: updatedOptions
			}, {
				sender: 'TimelinePanelCtrl'
			});
		};

		var animationUpdateEventHandler = function animationUpdateEventHandler(target, operation) {
			if (target === 'Effect' || target === 'MediaFrame') {
				$scope.adaptMediaTimelines();
			} else if (target === 'Shape') {
				if ( operation === 'Create' || operation === 'Remove') {
					$scope.adaptMediaTimelines();
				}
			}
		};

		var getMediaTimeline = function getMediaTimeline(timelineId) {
			return animationService.getInstance().timeline.getMediaTimeline(timelineId);
		};

		var getEffect = function getEffect(timelineId, eventDataId) {
			var mediaTimeline = getMediaTimeline(timelineId);
			if (mediaTimeline) {
				return mediaTimeline.getEffect(eventDataId);
			}

			return undefined;
		};

		var changeSelectedEffect = function changeSelectedEffect(timelineId, eventDataId) {
			var effect = getEffect(timelineId, eventDataId);
			if (effect) {
				localAnimationStateService.setSelectedEffect(effect);
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

		$scope.onPointMove = function (timelineData, eventData, pointData, newTick) {
			var mediaTimeline = getMediaTimeline(timelineData.id);
			if (mediaTimeline) {
				var updatedOptions = {},
					pointKey = 'points.' + pointData.id + '.tick';

				updatedOptions[pointKey] = newTick;

				applyEffectUpdateOperation(mediaTimeline.getMediaObjectId(), eventData.id, updatedOptions);
			}
		};

		//html: point-click="onPointClick(timelineData, eventData, pointData)"
		//$scope.onPointClick = function (timelineData, eventData, pointData) {
		//	console.log('onPointClick');
		//	console.log(pointData);
		//
		//	var effect = getEffect(timelineData.id, eventData.id);
		//
		//	console.log(effect);
		//	console.log('------');
		//};

		$scope.onMultiplePointEventSelected = function (timelineData, eventData) {
			changeSelectedEffect(timelineData.id, eventData.id);
		};

		$scope.onEventStartChange = function (timelineData, eventData, newStartTick) {
			var mediaTimeline = getMediaTimeline(timelineData.id);
			if (mediaTimeline) {
				var updatedOptions = { startTick: newStartTick };

				applyEffectUpdateOperation(mediaTimeline.getMediaObjectId(), eventData.id, updatedOptions);
			}
		};

		$scope.onEventDurationChange = function (timelineData, eventData, newDuration) {
			var mediaTimeline = getMediaTimeline(timelineData.id);
			if (mediaTimeline) {
				var effect = mediaTimeline.getEffect(eventData.id),
					newEndTick = effect.getOption('startTick') + newDuration,
					updatedOptions = { endTick: newEndTick };

				applyEffectUpdateOperation(mediaTimeline.getMediaObjectId(), eventData.id, updatedOptions);
			}
		};

		$scope.onEventClick = function (timelineData, eventData){
			changeSelectedEffect(timelineData.id, eventData.id);
		};
	});
