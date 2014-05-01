'use strict';

angular.module('animatesApp')
	.factory('effectCreator', function effectCreator(timelineService, $window) {
		var Model = $window.model;
		
		return {
			addMoveEffectIfRequired : function addMoveEffectIfRequired(model, fabricObject, canvasPosition, mediaTimeline){
				var posXStart = model.getProperty('position.x'),
					posYStart = model.getProperty('position.y'),
					posXEnd = fabricObject.left - canvasPosition.left,
					posYEnd = fabricObject.top - canvasPosition.top;

				if (posXStart !== posXEnd || posYStart !== posYEnd) {
					var path = new Model.Path({
							startPosition: { x: posXStart, y: posYStart },
							endPosition: { x: posXEnd, y: posYEnd }
						}),
						moveEffect = new Model.MoveEffect({
							path : path,
							startTick : timelineService.getDefaultStartTick(), // TODO define start and end frames of the effect
							endTick : timelineService.getCurrentTick()
						});

					moveEffect.startTick = mediaTimeline.getStartTickFor(moveEffect, moveEffect.endTick);
					mediaTimeline.addEffect(moveEffect);
				}
			},
		};
	});
