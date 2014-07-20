'use strict';

angular.module('animatesApp')
	.factory('effectCreator', function effectCreator(localAnimationStateService, animationService) {
		var applyEffectCreationOperation = function applyEffectCreationOperation (mediaObjectId, effect, sender) {
					animationService.getInstance().applyOperation('Effect', 'Create', {
						mediaObjectId: mediaObjectId,
						effect: effect
					}, {
						sender: sender
					});
				},
				applyEffectUpdateOperation = function applyEffectUpdateOperation (mediaObjectId, effectId, options, sender) {
					animationService.getInstance().applyOperation('Effect', 'Update', {
						mediaObjectId: mediaObjectId,
						effectId: effectId,
						options: options
					}, {
						sender: sender
					});
				};

		var addMoveEffectIfRequired = function addMoveEffectIfRequired(updatedPropertiesDiff, originalProperties, mediaTimeline, sender) {
			var positionX = updatedPropertiesDiff['position.x'],
				positionY = updatedPropertiesDiff['position.y'],
				posXStart = (positionX) ? positionX.oldValue : originalProperties.position.x,
				posYStart = (positionY) ? positionY.oldValue : originalProperties.position.y,
				posXEnd = (positionX) ? positionX.newValue : originalProperties.position.x,
				posYEnd = (positionY) ? positionY.newValue : originalProperties.position.y,
				currentEffects = null,
				moveEffect = null;

			if (posXStart !== posXEnd || posYStart !== posYEnd) {
				moveEffect = new animationService.Model.MoveEffect({
					startTick : mediaTimeline.getStartTick(),
					endTick : localAnimationStateService.getCurrentTick(),
					path : 'Straight',
					startPosition: { x: posXStart, y: posYStart },
					endPosition: { x: posXEnd, y: posYEnd }
				});

				var effectsToSplit = [];
				// Check if an existant effect must be splitted
				currentEffects = mediaTimeline.getEffectsForTick(localAnimationStateService.getCurrentTick());
				if (currentEffects.length > 0) {
					for (var i = 0; i < currentEffects.length; i++) {
						if (moveEffect.HasConflictWithProperties(currentEffects[i])) {
							effectsToSplit.push(currentEffects[i]);
						}
					}
				}

				var mediaObjectId = mediaTimeline.getMediaObjectId();

				var addNewEffect = true;

				var effectToSplit, effectToSplitOptions, newPosition;

				// "Split" : Modify the found effect and insert the new one
				for (var j = 0; j < effectsToSplit.length; j++) {
					effectToSplit = effectsToSplit[j];

					effectToSplitOptions = null;

					if(effectToSplit.getOption('endTick') === moveEffect.getOption('endTick')) {
						newPosition = moveEffect.getOption('endPosition');

						effectToSplit.setOption('endPosition.x', newPosition.x);
						effectToSplit.setOption('endPosition.y', newPosition.y);
						effectToSplitOptions = {
							'endPosition.x': newPosition.x,
							'endPosition.y': newPosition.y,
						};

						addNewEffect = false;
					} else if (effectToSplit.getOption('startTick') === moveEffect.getOption('endTick')) {
						newPosition = moveEffect.getOption('endPosition');

						effectToSplit.setOption('startPosition.x', newPosition.x);
						effectToSplit.setOption('startPosition.y', newPosition.y);
						effectToSplitOptions = {
							'startPosition.x': newPosition.x,
							'startPosition.y': newPosition.y,
						};

						addNewEffect = false;
					} else {
						newPosition = effectToSplit.getOption('startPosition');
						moveEffect.setOption('startPosition.x', newPosition.x);
						moveEffect.setOption('startPosition.y', newPosition.y);

						newPosition = { x: posXEnd, y : posYEnd };
						effectToSplit.setOption('startPosition.x', newPosition.x);
						effectToSplit.setOption('startPosition.y', newPosition.y);

						effectToSplitOptions = {
							startTick : moveEffect.getOption('endTick'),
							'startPosition.x': newPosition.x,
							'startPosition.y': newPosition.y,
						};
					}

					applyEffectUpdateOperation(mediaObjectId, effectToSplit.getGuid(), effectToSplitOptions, sender);
				}

				if (addNewEffect) {
					moveEffect.setOption('startTick', mediaTimeline.getStartTickFor(moveEffect, moveEffect.getOption('endTick')));
					applyEffectCreationOperation(mediaObjectId, moveEffect, sender);
				}
			}

			if (updatedPropertiesDiff['position.x']) {
				delete updatedPropertiesDiff['position.x'];
			}

			if (updatedPropertiesDiff['position.y']) {
				delete updatedPropertiesDiff['position.y'];
			}
		};

		return {
			addAndUpdateEffects : function addAndUpdateEffects(updatedPropertiesDiff, originalProperties, mediaTimeline, sender) {
				addMoveEffectIfRequired(updatedPropertiesDiff, originalProperties, mediaTimeline, sender);

				var newUpdatedProperties = {};

				for(var propName in updatedPropertiesDiff) {
					if(updatedPropertiesDiff.hasOwnProperty(propName)) {
						newUpdatedProperties[propName] = updatedPropertiesDiff[propName].newValue;
					}
				}

				return newUpdatedProperties;
			}
		};
	});
