'use strict';

angular.module('animatesApp')
	.directive('animatesPlayertimeline', function ($timeout, $document) {
		return {
			restrict: 'E',
			template:
						'<span class="timetooltip"></span>' +
						'<div class="timelines-tick-navigator">' +
							'<div class="tickHandlerHeader" ></div>' +
							'<div class="tickHandlerScrollerContainer" >' +
								'<div class="tickHandlerContainer" style="width:{{maxTick}}px;">' +
									'<div class="ruler"></div>' +
									'<div class="tickHandler" style="left:{{tick-5}}px;"></div>' +
								'</div>' +
							'</div>' +
						'</div>',
			scope: {
				externalTick: '=tick',
				tickChange: '&',
				tickRatio: '=',
				width: '='
			},
			controller : function ($scope, $element) {
				var ruleElement = angular.element($element[0].querySelector('.ruler'));

				$scope.tick = $scope.externalTick;
				$scope.maxTick = 5000;
				$scope.width = $scope.width || 500;

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

				$scope.internalTickChange = function () {
					$scope.$apply(function (){ $scope.externalTick = $scope.tick;});

					if ($scope.tickChange) {
						$scope.tickChange( { tick: $scope.tick });
					}
				};
			},
			link : {
				post : function ($scope, element) {
					$scope.drawRule();

					var x, originalTick,
						tickHandlerElement = angular.element(element[0].querySelector('.tickHandler')),
						tooltipElement = angular.element(element[0].querySelector('.timetooltip')),
						bodyElement = angular.element($document[0].querySelector('body'));


					// append the tooltip to the body so it can be display above any element.
					tooltipElement.remove();
					bodyElement.append(tooltipElement);

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
						// Move the tick to the new position
						setTick(event.pageX);
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
