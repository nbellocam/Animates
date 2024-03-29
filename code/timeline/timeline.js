/**
@toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
TODO

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
TODO

@dependencies
TODO

@usage
partial / html:
TODO

controller / js:
TODO

//end: usage
*/

'use strict';

angular.module('animates.angular-timeline', [])
	.directive('animatesTimelinepoint', function ($document) {
		return {
			restrict: 'E',
			template:	'',
			scope: {
				timelineTick: '=',
				point: '=',
				eventData: '=',
				isDisable: '=',
				pointMove: '&',
				pointClick: '&',
				multiplepointeventSelected: '&'
			},
			link:
			{
				pre: function ($scope, element) {
					element.css({
						left: $scope.point.tick + 'px'
					});
				},
				post: function ($scope, element) {
					var point = $scope.point,
						x, originalZIndex,
						originalTick;

					element.on('click', function () {
							if (!$scope.isDisable) {
								$scope.pointClick({
									eventData : $scope.eventData,
									pointData : point.data
								});
							}
						});

					element.on('mousedown', function(event) {
						if (!$scope.isDisable) {
							originalTick = point.tick;
							// Prevent default dragging of selected content
							event.preventDefault();

							x = event.pageX - point.tick;
							originalZIndex = element.css('z-index');

							element.css({
								'z-index': 1000
							});

							$document.on('mousemove', elementMove);
							$document.on('mouseup', elementMoveEnd);
						}
					});

					function elementMove(event) {
						var newTick = event.pageX - x;
						if (newTick > 0) {
							point.tick = newTick;
							element.css({
								left: newTick + 'px'
							});
						}
						$scope.$apply();
					}

					function elementMoveEnd() {
						$document.unbind('mousemove', elementMove);
						$document.unbind('mouseup', elementMoveEnd);

						element.css({
							'z-index': originalZIndex
						});

						if (point.tick !== originalTick) {
							$scope.pointMove({
								eventData : $scope.eventData,
								pointData : point.data,
								newTick : point.tick
							});
						}

						$scope.multiplepointeventSelected({
							eventData : $scope.eventData
						});
					}
				}
			}
		};
	})
	.directive('animatesTimelineevent', function ($document) {
		return {
			restrict: 'E',
			template:	'<span class="left" ng-class="{cursor: !isDisable, highlight: evt.start === timelineTick}"></span><span class="center" ng-class="{cursor: !isDisable}"></span><span class="right" ng-class="{cursor: !isDisable, highlight: (evt.start + evt.duration) === timelineTick}"></span>',
			scope: {
				evt: '=',
				isDisable: '=',
				eventStartchange: '&',
				eventDurationchange: '&',
				timelineTick: '=',
				eventClick: '&'
			},
			link: function ($scope, element) {
				var evt = $scope.evt,
					x, originalDuration, originalStart, originalZIndex, originalEndPosition,
					leftElement = angular.element(element[0].querySelector('.left')),
					centerElement = angular.element(element[0].querySelector('.center')),
					rightElement = angular.element(element[0].querySelector('.right')),
					border = 30;

				element.css({
					left: evt.start + 'px',
					width: evt.duration + 'px'
				});

				centerElement.css({
					width: (evt.duration - border) + 'px'
				});

				element.addClass(evt.class);

				element.on('click', function () {
					if (!$scope.isDisable) {
						$scope.eventClick({
							eventData : evt.data
						});
					}
				});

				leftElement.on('mousedown', function(event) {
					if (!$scope.isDisable) {
						// Prevent default dragging of selected content
						event.preventDefault();
						x = event.pageX - evt.start;
						originalDuration = evt.duration;
						originalStart = evt.start;
						originalZIndex = element.css('z-index');
						originalEndPosition = evt.start + evt.duration;

						element.css({
							'z-index': 1000
						});

						$document.on('mousemove', elementExpandFront);
						$document.on('mouseup', elementExpandFrontEnd);
					}
				});

				rightElement.on('mousedown', function(event) {
					if (!$scope.isDisable) {
						// Prevent default dragging of selected content
						event.preventDefault();
						x = event.pageX - evt.start;
						originalDuration = evt.duration;
						originalZIndex = element.css('z-index');

						element.css({
							'z-index': 1000
						});

						$document.on('mousemove', elementExpandBack);
						$document.on('mouseup', elementExpandBackEnd);
					}
				});

				centerElement.on('mousedown', function(event) {
					if (!$scope.isDisable) {
						// Prevent default dragging of selected content
						event.preventDefault();
						x = event.pageX - evt.start;
						originalDuration = evt.duration;
						originalStart = evt.start;
						originalZIndex = element.css('z-index');

						element.css({
							'z-index': 1000
						});

						$document.on('mousemove', elementMove);
						$document.on('mouseup', elementMoveEnd);
					}
				});

				function elementMove(event) {
					var newStart = event.pageX - x;
					if (newStart > 0) {
						evt.start = newStart;
						element.css({
							left: newStart + 'px'
						});
					}
					$scope.$apply();
				}

				function elementMoveEnd() {
					$document.unbind('mousemove', elementMove);
					$document.unbind('mouseup', elementMoveEnd);

					element.css({
						'z-index': originalZIndex
					});

					if (evt.start !== originalStart) {
						$scope.eventStartchange({
							eventData : evt.data,
							newStartTick : evt.start
						});
					}
				}

				function elementExpandFront(event) {
					var newStart = event.pageX - x,
							newDuration = originalEndPosition - newStart;

					if (newStart > 0 && newDuration > 0) {
						evt.duration = newDuration;
						evt.start = newStart;
						element.css({
							left: newStart + 'px',
							width: newDuration + 'px'
						});

						centerElement.css({
							width: (newDuration - border) + 'px'
						});
					}
					$scope.$apply();
				}

				function elementExpandFrontEnd() {
					$document.unbind('mousemove', elementExpandFront);
					$document.unbind('mouseup', elementExpandFrontEnd);

					element.css({
						'z-index': originalZIndex
					});

					if (evt.start !== originalStart) {
						$scope.eventStartchange({
							eventData : evt.data,
							newStartTick : evt.start
						});
					}

					if (evt.duration !== originalDuration){
						$scope.eventDurationchange({
							eventData : evt.data,
							newDuration : evt.duration
						});
					}
				}

				function elementExpandBack(event) {
					var newStart = event.pageX - x,
						newDuration = (newStart - evt.start) + originalDuration;

					if (newDuration > 0) {
						evt.duration = newDuration;
						element.css({
							width: newDuration + 'px'
						});

						centerElement.css({
							width: (newDuration - border) + 'px'
						});
					}
					$scope.$apply();
				}

				function elementExpandBackEnd() {
					$document.unbind('mousemove', elementExpandBack);
					$document.unbind('mouseup', elementExpandBackEnd);

					element.css({
						'z-index': originalZIndex
					});

					if (evt.duration !== originalDuration){
						$scope.eventDurationchange({
							eventData : $scope.evt.data,
							newDuration : evt.duration
						});
					}
				}
			}
		};
	})
	.directive('animatesTimeline', function () {
		return {
			restrict: 'E',
			template:	'<div class="timeline-content">' +
									'<animates-timelinepoint class="timeline-point" ng-repeat="point in line.points" point="point" event-data="$parent.line.data" is-disable="isDisable" ng-class="{cursor: !isDisable, highlight: timelineTick === point.tick}" timeline-tick="timelineTick"' +
										'point-move="internalPointMove(eventData, pointData, newTick)" ' +
										'point-click="internalPointClick(eventData, pointData)" ' +
										'multiplepointevent-selected="internalMultiplePointEventSelected(eventData)">' +
									'</animates-timelinepoint>' +

									'<animates-timelineevent class="timeline-event" ng-repeat="event in line.events" evt="event" timeline-tick="timelineTick" is-disable="isDisable" ng-class="{highlight : (timelineTick >= event.start) && (timelineTick <= (event.start + event.duration))}"' +
										'event-startchange="internalEventStartChange(eventData, newStartTick)" ' +
										'event-durationchange="internalEventDurationChange(eventData, newDuration)" ' +
										'event-click="internalEventClick(eventData)">' +
									' </animates-timelineevent>' +
								'</div>',
			scope: {
				line: '=data',
				timelineData: '=',
				isDisable: '=',
				eventStartchange: '&',
				eventDurationchange: '&',
				eventClick: '&',
				pointMove: '&',
				pointClick: '&',
				multiplepointeventSelected: '&',
				maxTick: '=',
				timelineTick: '='
			},
			controller : function ($scope) {
				$scope.internalEventStartChange = function (eventData, newStartTick) {
					if ($scope.eventStartchange) {
						$scope.eventStartchange({
							timelineData : $scope.timelineData,
							eventData : eventData,
							newStartTick : newStartTick
						});
					}
				};

				$scope.internalEventDurationChange = function (eventData, newDuration) {
					if ($scope.eventDurationchange) {
						$scope.eventDurationchange({
							timelineData : $scope.timelineData,
							eventData : eventData,
							newDuration : newDuration
						});
					}
				};

				$scope.internalEventClick = function (eventData) {
					if ($scope.eventClick) {
						$scope.eventClick({
							timelineData : $scope.timelineData,
							eventData : eventData
						});
					}
				};

				$scope.internalPointMove = function (eventData, pointData, newTick) {
					if ($scope.pointMove) {
						$scope.pointMove({
							timelineData : $scope.timelineData,
							eventData : eventData,
							pointData : pointData,
							newTick : newTick
						});
					}
				};

				$scope.internalPointClick = function (eventData, pointData) {
					if ($scope.pointClick) {
						$scope.pointClick({
							timelineData : $scope.timelineData,
							eventData : eventData,
							pointData : pointData
						});
					}
				};

				$scope.internalMultiplePointEventSelected = function (eventData) {
					if ($scope.multiplepointeventSelected) {
						$scope.multiplepointeventSelected({
							timelineData : $scope.timelineData,
							eventData : eventData
						});
					}
				};
			},
			link: function ($scope, element) {
				if ($scope.line.points) {
					element.addClass('points');
				}

				if ($scope.line.events) {
					element.addClass('events');
				}
			}
		};
	})
	.directive('animatesTimelines', function ($timeout, $document) {
		return {
			restrict: 'E',
			template:
						'<span class="timetooltip"></span>' +
						'<div class="timelines-tick-navigator">' +
							'<div class="tickHandlerHeader" ></div>' +
							'<div class="tickHandlerScrollerContainer" >' +
								'<div class="tickHandlerContainer" style="width:{{maxTick}}px;">' +
									'<div class="ruler"></div>' +
									'<div class="tickHandler" style="left:{{tick-5}}px;" ng-class="{cursor: !isDisable}"></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="timelines-group">' +
							'<div class="timelinesHeaders">' +
								'<div ng-repeat="timeline in data" class="timeline-part timeline-header" data="timeline.data" rel="{{$index}}">' +
									'<span class="timeline-header-track" title="{{timeline.name}}" >{{timeline.name}}</span>' +
								'</div>' +
							'</div>' +
							'<div class="timelinesContainer">' +
								'<div class="verticalLine" style="left:{{tick}}px"></div>' +
								'<div ng-repeat="timeline in data" class="timeline-part timeline" data="timeline.data">' +
									'<div class="elementLinesContainer" rel="{{$index}}" style="width:{{maxTick}}px;">' +

										'<animates-timeline ng-repeat="line in timeline.lines" data="line" timeline-data="timeline.data" timeline-tick="tick" max-tick="maxTick" is-disable="isDisable"' +
											'point-move="internalPointMove(timelineData, eventData, pointData, newTick)" ' +
											'point-click="internalPointClick(timelineData, eventData, pointData)" ' +
											'multiplepointevent-selected="internalMultiplePointEventSelected(timelineData, eventData)" ' +
											'event-startchange="internalEventStartChange(timelineData, eventData, newStartTick)" ' +
											'event-durationchange="internalEventDurationChange(timelineData, eventData, newDuration)" ' +
											'event-click="internalEventClick(timelineData, eventData)">' +
										'</animates-timeline>' +

									'</div>' +
								'</div>' +
							'</div>' +

						'</div>',
			scope: {
				data: '=',
				externalTick: '=tick',
				isDisable: '=',
				tickChange: '&',
				eventStartchange: '&',
				eventDurationchange: '&',
				eventClick: '&',
				pointMove: '&',
				pointClick: '&',
				multiplepointeventSelected: '&',
				tickRatio: '='
			},
			controller : function ($scope, $element) {
				var ruleElement = angular.element($element[0].querySelector('.ruler'));

				$scope.tick = $scope.externalTick;
				$scope.maxTick = 5000;


				$scope.drawRule =  function () {
					// Horizontal ruler ticks
					var tickLabelPos = 0,
						width = $scope.maxTick,
						newTickLabel = '',
						interval = 5;

					ruleElement[0].innerHTML = '';

					while ( tickLabelPos <= width ) {
						if ((( tickLabelPos ) %50 ) === 0 ) {
							newTickLabel = '<div class="tickLabel"></div>';
							ruleElement.append(angular.element(newTickLabel).css( 'left', tickLabelPos+'px' ));
						} else if ((( tickLabelPos) %10 ) === 0 ) {
							newTickLabel = '<div class="tickMajor"></div>';
							ruleElement.append(angular.element(newTickLabel).css('left',tickLabelPos+'px'));
						} else if ((( tickLabelPos) %5 ) === 0 ) {
							newTickLabel = '<div class="tickMinor"></div>';
							ruleElement.append(angular.element(newTickLabel).css( 'left', tickLabelPos+'px' ));
						}
						tickLabelPos = (tickLabelPos + interval);
					}//hz ticks
				};

				$scope.$watch('externalTick', function() {

					$scope.tick = $scope.externalTick;

					if ($scope.tickChange) {
						$scope.tickChange( { tick: $scope.tick });
					}
				});

				$scope.$watch('maxTick', function () {
					$scope.drawRule();
				});

				$scope.$watchCollection('data', function() {
					$scope.updateHeaders();
				});

				$scope.getTime = function (tick) {
					return (tick * $scope.tickRatio / 1000);
				};

				$scope.formatTime = function (tick) {
					if ($scope.tickRatio) {
						var totalSeconds = $scope.getTime(tick),
							hours   = Math.floor(totalSeconds / 3600),
							minutes = Math.floor((totalSeconds - (hours * 3600)) / 60),
							seconds = totalSeconds - (hours * 3600) - (minutes * 60);

						seconds = seconds.toFixed(3);

						if (hours   < 10) {hours   = '0' + hours;}
						if (minutes < 10) {minutes = '0' + minutes;}
						if (seconds < 10) {seconds = '0' + seconds;}

						return (hours + ':' + minutes + ':' + seconds);
					} else {
						return 'Tick: ' + tick;
					}
				};

				$scope.updateHeaders = function () {
					$timeout(function () {
						angular.forEach($element[0].querySelectorAll('.elementLinesContainer'), function(timeline) {
							var index = angular.element(timeline).attr('rel'),
								height = angular.element(timeline)[0].offsetHeight;

							angular.element($element[0]
								.querySelector('.timeline-header[rel="' + index + '"]'))
									.css({
									'line-height' : height + 'px',
									'height' : height + 'px'
								});
						});
					});
				};


				$scope.internalTickChange = function () {
					$scope.$apply(function (){ $scope.externalTick = $scope.tick;});

					if ($scope.tickChange) {
						$scope.tickChange( { tick: $scope.tick });
					}
				};

				$scope.internalEventStartChange = function (timelineData, eventData, newStartTick) {
					if ($scope.eventStartchange) {
						$scope.eventStartchange({
							timelineData : timelineData,
							eventData : eventData,
							newStartTick : newStartTick
						});
					}
				};

				$scope.internalEventDurationChange = function (timelineData, eventData, newDuration) {
					if ($scope.eventDurationchange) {
						$scope.eventDurationchange({
							timelineData : timelineData,
							eventData : eventData,
							newDuration : newDuration
						});
					}
				};

				$scope.internalEventClick = function (timelineData, eventData) {
					if ($scope.eventClick) {
						$scope.eventClick({
							timelineData : timelineData,
							eventData : eventData
						});
					}
				};

				$scope.internalPointMove = function (timelineData, eventData, pointData, newTick) {
					if ($scope.pointMove) {
						$scope.pointMove({
							timelineData : timelineData,
							eventData : eventData,
							pointData : pointData,
							newTick : newTick
						});
					}
				};

				$scope.internalPointClick = function (timelineData, eventData, pointData) {
					if ($scope.pointClick) {
						$scope.pointClick({
							timelineData : timelineData,
							eventData : eventData,
							pointData : pointData
						});
					}
				};

				$scope.internalMultiplePointEventSelected = function (timelineData, eventData) {
					if ($scope.multiplepointeventSelected) {
						$scope.multiplepointeventSelected({
							timelineData : timelineData,
							eventData : eventData
						});
					}
				};
			},
			link : {
				post : function ($scope, element) {

					$scope.updateHeaders();
					$scope.drawRule();

					var x, originalTick,
						tickHandlerElement = angular.element(element[0].querySelector('.tickHandler')),
						timelineContainerElement = angular.element(element[0].querySelector('.timelinesContainer')),
						tickHandlerScrollerContainerElement = angular.element(element[0].querySelector('.tickHandlerScrollerContainer')),
						tooltipElement = angular.element(element[0].querySelector('.timetooltip')),
						bodyElement = angular.element($document[0].querySelector('body'));


					// append the tooltip to the body so it can be display above any element.
					tooltipElement.remove();
					bodyElement.append(tooltipElement);

					function scrollTime(toTick) {
						// Validate bounds
						if ((toTick < 0)) {
							return;
						}

						// Scroll timelines and the current tick marker
						timelineContainerElement[0].scrollLeft = toTick;
						tickHandlerScrollerContainerElement[0].scrollLeft = toTick;
					}

					function setTick(newTick) {
						$scope.$apply(function () {
							if (newTick < 0) {
								$scope.tick = 0;
							} else if (newTick >= $scope.maxTick) {
								$scope.tick = $scope.maxTick;
								$scope.maxTick += 100;
							} else {
								$scope.tick = newTick;
							}
						});

						originalTick = newTick;
						$scope.internalTickChange();
					}

					function getCurrentScrollPos() {
						return timelineContainerElement[0].scrollLeft;
					}

					function getRect(element) {
						return element[0].getBoundingClientRect();
					}

					function followMouse (evt) {
						var rect = getRect(tickHandlerScrollerContainerElement),
							currentTick = getCurrentScrollPos() + evt.pageX - rect.left;

						tooltipElement.html($scope.formatTime(currentTick));
						tooltipElement.css({
								'left' : (evt.pageX - (tooltipElement.prop('offsetWidth') / 2)) + 'px',
								'top': (evt.pageY - 5 - tooltipElement.prop('offsetHeight')) + 'px'
							});

						tooltipElement.addClass('active');
					}

					timelineContainerElement.on('scroll', function () {
						var tick = timelineContainerElement[0].scrollLeft;
						scrollTime(tick);
					});

					tickHandlerScrollerContainerElement.on('mousedown', function () {
						if (!$scope.isDisable) {
							var rect = getRect(tickHandlerScrollerContainerElement);

							setTick(getCurrentScrollPos() + event.pageX - rect.left);
						}
					});

					tickHandlerScrollerContainerElement.on('mouseover', function (event) {
						followMouse(event);
						$document.on('mousemove', followMouse);
					});

					tickHandlerScrollerContainerElement.on('mouseout', function () {
						$document.unbind('mousemove', followMouse);

						tooltipElement.removeClass('active');
					});

					tickHandlerElement.on('mousedown', function(event) {
						if (!$scope.isDisable) {
							tickHandlerElement.addClass('moving');

							// Prevent default dragging of selected content
							event.preventDefault();
							event.stopPropagation();

							x = event.pageX - $scope.tick;
							originalTick = $scope.tick;

							$document.on('mousemove', tickHandlerMove);
							$document.on('mouseup', tickHandlerMoveEnd);
						}
					});

					function tickHandlerMove(event) {
						var mouseX = event.pageX,
							containerRect = getRect(tickHandlerScrollerContainerElement),
							relativeMouseX = mouseX - containerRect.left,
							scrollSpeed = 10;

						// Chek for auto scroll when mouse is outside rect edges
						if (mouseX > (containerRect.right)) {
							scrollTime(getCurrentScrollPos() + scrollSpeed);
						} else if (mouseX < containerRect.left){
							scrollTime(getCurrentScrollPos() - scrollSpeed);
						}

						// Move the tick to the new position
						setTick(getCurrentScrollPos() + relativeMouseX);
					}

					function tickHandlerMoveEnd() {
						$document.unbind('mousemove', tickHandlerMove);
						$document.unbind('mouseup', tickHandlerMoveEnd);

						if (originalTick !== $scope.tick) {
							$scope.internalTickChange();
						}

						tickHandlerElement.removeClass('moving');
					}
				}
			}
		};
	});
