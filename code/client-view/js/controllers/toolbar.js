'use strict';

animates.controller('ToolbarCtrl', function($scope, shapeCreator, currentCanvas) {
    $scope.addRectangle = function() {
      if (currentCanvas.instance){
        currentCanvas.instance.add(shapeCreator.createRectangle());
      }
    };

    $scope.addCircle = function() {
      alert("Circle still not available!");
    };

    $scope.addTriangle = function() {
      alert("Triangle still not available!");
    };

    $scope.addStar = function() {
      alert("Star still not available!");
    };

    $scope.addImage = function() {
      alert("Image still not available!");
    };

    $scope.addText = function() {
      alert("Text still not available!");
    };

    $scope.addSound = function() {
      alert("Sound still not available!");
    };

    $scope.removeElements = function() {
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
                canvas.remove(objects[j]);
              };
            } else {
              canvas.remove(object);
            }
          }
        }
      }
      
      canvas.renderAll();
    };
});