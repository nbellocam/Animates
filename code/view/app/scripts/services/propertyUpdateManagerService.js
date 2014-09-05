'use strict';

angular.module('animatesEditor')
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
      };

    this.syncProperties = function syncProperties(mediaObjectId, updatedProperties, sender) {
      if (!isEmpty(updatedProperties)) {
        applyMediaFrameUpdateOperation(mediaObjectId, updatedProperties, sender);
      }
    };

  });
