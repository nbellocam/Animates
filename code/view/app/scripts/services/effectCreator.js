'use strict';

angular.module('animatesApp')
	.factory('effectCreator', function effectCreator(localAnimationStateService, $window, animationService) {
		var Model = $window.model,
			applyEffectCreationOperation = function applyEffectCreationOperation (mediaObjectId, effect){
				animationService.getInstance().applyOperation('Effect', 'Create', {
					mediaObjectId: mediaObjectId,
					effect: effect
				}, {
					sender: 'effectCreator'
				});
			},
			applyEffectUpdateOperation = function applyEffectUpdateOperation (mediaObjectId, effectId, options){
				animationService.getInstance().applyOperation('Effect', 'Update', {
					mediaObjectId: mediaObjectId,
					effectId: effectId,
					options: options
				}, {
					sender: 'effectCreator'
				});
			};

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
						startTick : mediaTimeline.getStartTick(),
						endTick : localAnimationStateService.getCurrentTick()
					});

					// Check if an existant effect must be splitted
					currentEffects = mediaTimeline.getEffectsForTick(localAnimationStateService.getCurrentTick());
					if (currentEffects.length > 0) {
						for (var i = 0; i < currentEffects.length; i++) {
							if (moveEffect.HasConflictWithProperties(currentEffects[i])) {
								effectToSplit = currentEffects[i];

								// TODO: for now im suposing that only one effect must have conflicts
								break;
							}
						}
					}

					var mediaObjectId = mediaTimeline.getMediaObjectId();

					// "Split" : Modify the found effect and insert the new one
					if (effectToSplit) {
						var effectToSplitPath = effectToSplit.getOption('path');
						moveEffect.getOptions('path').startPosition = effectToSplitPath.startPosition;

						effectToSplitPath.startPosition = { x: posXEnd, y : posYEnd };
						var effectToSplitOptions = {
							startTick : localAnimationStateService.getCurrentTick(),
							path: effectToSplitPath
						};
						
						applyEffectUpdateOperation(mediaObjectId, effectToSplit.getGuid(), effectToSplitOptions);
					}
					
					moveEffect.setOption('startTick', mediaTimeline.getStartTickFor(moveEffect, moveEffect.getOption('endTick')));


					applyEffectCreationOperation(mediaObjectId, moveEffect);
				}
			}
		};
	});
