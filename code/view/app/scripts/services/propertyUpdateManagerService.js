'use strict';

angular.module('animatesApp')
  .service('propertyUpdateManagerService', function propertyUpdateManagerService(localAnimationStateService, animationService) {

    var applyMediaFrameUpdateOperation = function applyMediaFrameUpdateOperation(mediaObjectId, updatedProperties, sender) {
        animationService.getInstance().applyOperation('MediaFrame', 'Update', {
          mediaObjectId :  mediaObjectId,
          updatedProperties: updatedProperties,
          tick: localAnimationStateService.getCurrentTick(),
        }, {
          sender: sender
        });
      },
      isEmpty = function isEmpty(obj) {
        //TODO use the one in Common
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop)) {
            return false;
          }
        }

        return true;
      };//,
      //createUpdatedPropertiesDiff = function createUpdatedPropertiesDiff (updatedProperties, mediaTimeline) {
      //  var mediaFrame = mediaTimeline.getMediaFrameFor(localAnimationStateService.getCurrentTick()),
      //    updatedPropertiesDiff = {};
      //
      //  for(var propName in updatedProperties) {
      //    if(updatedProperties.hasOwnProperty(propName)) {
      //      updatedPropertiesDiff[propName] = {
      //        oldValue : mediaFrame.getProperty(propName),
      //        newValue : updatedProperties[propName]
      //      };
      //    }
      //  }
      //
      //  return updatedPropertiesDiff;
      //};

    this.syncProperties = function syncProperties(mediaObjectId, updatedProperties, sender) {
      if (!isEmpty(updatedProperties)) {
        applyMediaFrameUpdateOperation(mediaObjectId, updatedProperties, sender);
        //var mediaTimeline = animationService.getInstance().timeline.getMediaTimeline(mediaObjectId);
        //var newUpdatedProperties = updatedProperties;

        //if(!localAnimationStateService.startsAtCurrentTick(mediaTimeline)) {
          //var updatedPropertiesDiff = createUpdatedPropertiesDiff (updatedProperties, mediaTimeline),
            //mediaFrame = mediaTimeline.getMediaFrameFor(localAnimationStateService.getCurrentTick());

          //newUpdatedProperties = effectCreator.addAndUpdateEffects(updatedPropertiesDiff, mediaFrame.properties(), mediaTimeline, sender);
        //}

        //if (!isEmpty(newUpdatedProperties)) {
          //applyShapeUpdateOperation(mediaObjectId, newUpdatedProperties, sender);
        //}
      }
    };

  });
