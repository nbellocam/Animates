'use strict';

angular.module('animatesPlayer')
	.directive('animatesPlayertimeline', function ($timeout, $document, $window) {
		return {
			restrict: 'E',
			template:	'<span class="timetooltip"></span>' +
						'<div class="timelines-tick-navigator" style="width:{{width}}px;" >' +
							'<div class="timeline-controls" ng-click="tooglePlay()" >' +
								'<span class="glyphicon player-button" ng-class="{\'glyphicon-pause\': playing, \'glyphicon-play\': !playing}"></span>' +
							'</div>' +
							'<div class="tickHandlerScrollerContainer" style="width:{{rulerWidth}}px;" >' +
								'<div class="tickHandlerContainer" style="width:{{rulerWidth}}px;">' +
									'<div class="ruler" style="width:{{tick}}px;"></div>' +
									'<div class="tickHandler" style="left:{{tick}}px;"></div>' +
								'</div>' +
							'</div>' +
						'</div>',
			scope: {
				externalTick: '=tick',
				tickChange: '&',
				onToggleplaying: '&',
				tickRatio: '=',
				width: '=',
				maxTick: '='
			},
			controller : function ($scope, $element) {
				var timelineControls = angular.element($element[0].querySelector('.timeline-controls'));

				$scope.playing = $scope.playing || false;
				$scope.tick = $scope.externalTick;
				$scope.maxTick = $scope.maxTick || 5000;
				$scope.width = $scope.width || 500;
				$scope.rulerWidth = $scope.width - timelineControls.width() - 3;
				$scope.tickRate = $window.Math.round($scope.maxTick / $scope.rulerWidth);

				$scope.tooglePlay = function() {
					$scope.playing = !$scope.playing;
					$scope.onToggleplaying({ playing: $scope.playing });
				};

				$scope.$watch('externalTick', function() {
					$scope.tick = $scope.externalTick / $scope.tickRate;

					if ($scope.tickChange) {
						$scope.tickChange( { tick: $scope.externalTick });
					}
				});

				$scope.getTime = function (tick) {
					return (tick * $scope.tickRatio / 1000);
				};

				$scope.formatTime = function (tick) {
					if ($scope.tickRatio) {
						var totalSeconds = $scope.getTime(tick * $scope.tickRate),
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

				$scope.internalTickChange = function () {
					$scope.$apply(function (){ $scope.externalTick = $scope.tick * $scope.tickRate;});

					if ($scope.tickChange) {
						$scope.tickChange( { tick: $scope.externalTick });
					}
				};
			},
			link : {
				post : function ($scope, element) {
					var x, originalTick,
						tickHandlerElement = angular.element(element[0].querySelector('.tickHandler')),
						tooltipElement = angular.element(element[0].querySelector('.timetooltip')),
						tickHandlerScrollerContainerElement = angular.element(element[0].querySelector('.tickHandlerScrollerContainer')),
						bodyElement = angular.element($document[0].querySelector('body'));

					element.css('width', $scope.width);
					// append the tooltip to the body so it can be display above any element.
					tooltipElement.remove();
					bodyElement.append(tooltipElement);

					function setTick(newTick) {
						$scope.$apply(function () {
							if (newTick < 0) {
								$scope.tick = 0;
							} else if (newTick >= $scope.maxTick) {
								$scope.tick = $scope.maxTick;
							} else {
								$scope.tick = newTick;
							}
						});

						originalTick = newTick;
						$scope.internalTickChange();
					}

					function getRect(element) {
						return element[0].getBoundingClientRect();
					}

					function followMouse (evt) {
						var rect = getRect(tickHandlerScrollerContainerElement),
							currentTick = evt.pageX - rect.left;

						tooltipElement.html($scope.formatTime(currentTick));
						tooltipElement.css({
								'left' : (evt.pageX - (tooltipElement.prop('offsetWidth') / 2)) + 'px',
								'top': (evt.pageY - 5 - tooltipElement.prop('offsetHeight')) + 'px'
							});

						tooltipElement.addClass('active');
					}

					tickHandlerScrollerContainerElement.on('mousedown', function () {
						if (!$scope.isDisable) {
							var rect = getRect(tickHandlerScrollerContainerElement);

							setTick(event.pageX - rect.left);
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
						if (!$scope.playing) {
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
						// Move the tick to the new position
						setTick(event.pageX - x);
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
