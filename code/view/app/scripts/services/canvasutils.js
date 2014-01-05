'use strict';

angular.module('animatesApp')
  .factory('canvasUtils', function (currentCanvas) {
    var applyToActiveElements = function applyToActiveElements(activeElementFunction){
      var canvas = currentCanvas.instance;

      if (canvas){
        var allObjects = canvas.getObjects(),
          j, object, objects;

        for (var i = 0; i < allObjects.length; i++) {
          object = allObjects[i]
          if (object.active) {
            if (object.group) {
              objects = object.group.objects;
              for (j = objects.length - 1; j >= 0; j--) {
                activeElementFunction(objects[j]);
              };
            } else {
              activeElementFunction(object);
            }
          }
        }
      }
    };
    
    return {
      applyToActiveElements : applyToActiveElements
    };
  });
