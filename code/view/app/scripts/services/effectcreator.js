'use strict';

angular.module('animatesApp')
	.factory('effectCreator', function effectCreator(timelineService, $window) {
		var Model = $window.model;
		
		return {
			addMoveEffectIfRequired : function addMoveEffectIfRequired(model, fabricObject, canvasPosition, mediaTimeline){
				var posXStart = model.getProperty('position.x'),
					posYStart = model.getProperty('position.y'),
					posXEnd = fabricObject.left - canvasPosition.left,
					posYEnd = fabricObject.top - canvasPosition.top,
					currentEffects = null,
					path = null,
					moveEffect = null,
					effectToSplit = null;

				if (posXStart !== posXEnd || posYStart !== posYEnd) {
					path = new Model.Path({
						startPosition: { x: posXStart, y: posYStart },
						endPosition: { x: posXEnd, y: posYEnd }
					});

					moveEffect = new Model.MoveEffect({
						path : path,
						startTick : timelineService.getDefaultStartTick(),
						endTick : timelineService.getCurrentTick()
					});

					// Check if an existant effect must be splitted
					currentEffects = mediaTimeline.getEffectsForTick(timelineService.getCurrentTick());
					if (currentEffects.length > 0) {
						for (var i = 0; i < currentEffects.length; i++) {
							if (moveEffect.HasConflictWithProperties(currentEffects[i])) {
								effectToSplit = currentEffects[i];

								// TODO: for now im suposing that only one effect must have conflicts
								break;
							}
						}
					}
					
					// "Split" : Modify the found effect and insert the new one
					if (effectToSplit) {
						moveEffect.getOptions().path.startPosition = effectToSplit.getOptions().path.startPosition;
						
						effectToSplit.startTick = timelineService.getCurrentTick();
						effectToSplit.getOptions().path.startPosition = { x: posXEnd, y : posYEnd};
					}
					
					moveEffect.startTick = mediaTimeline.getStartTickFor(moveEffect, moveEffect.endTick);
					
					mediaTimeline.addEffect(moveEffect);
				}
			},
		};
	});
