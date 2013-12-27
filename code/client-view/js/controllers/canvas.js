animates.controller('CanvasCtrl', function($scope) {
	var canvas = new fabric.Canvas('mainCanvas');

    $scope.initialize = function() {
		canvas.setHeight(500);
		canvas.setWidth(800);


		var rect = new fabric.Rect({
			 	left: 50, top: 50, fill: 'red', width: 70, height: 150
			});

		rect.id = "Hola mundo";

		canvas.add(rect);

		canvas.on('object:modified', function(options) {
		  if (options.target) {
		    console.log('an object was clicked! ', options.target.type);
		  }
		});

		rect.set('angle', 45);
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