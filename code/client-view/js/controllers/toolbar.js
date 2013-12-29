'use strict';

animates.controller('ToolbarCtrl', function($scope, shapeCreator, currentCanvas) {
    $scope.addRectangle = function() {
      if (currentCanvas.instance){
        currentCanvas.instance.add(shapeCreator.createRectangle());
      }
    }

    $scope.addCircle = function() {
      alert("Circle still not available!");
    }

    $scope.addTriangle = function() {
      alert("Triangle still not available!");
    }

    $scope.addStar = function() {
      alert("Star still not available!");
    }

    $scope.addImage = function() {
      alert("Image still not available!");
    }

    $scope.addText = function() {
      alert("Text still not available!");
    }

    $scope.addSound = function() {
      alert("Sound still not available!");
    }
});