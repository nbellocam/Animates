'use strict';

angular.module('animatesEditor')
	.factory('effectHelper', function effectHelper($window, shapeHelper, localAnimationStateService) {
		var setDefaultTicks = function (effect, viewObject) {
			if (!effect.isInfinite()) {
				var mediaTimeline = shapeHelper.getMediaTimelineFromView(viewObject),
					endTick = localAnimationStateService.getCurrentTick();

				if (endTick === 0) {
					endTick = 100;
				}

				effect.setOption('endTick', endTick);

				var startTick = mediaTimeline.getStartTickFor(effect, endTick);
				if (startTick >= endTick) {
					effect.setOption('endTick', startTick + 100);
				}

				effect.setOption('startTick', startTick);
			}

			return effect;
		};

		return {
			Model: $window.model,
			setDefaultTicks : setDefaultTicks
		};
	});
