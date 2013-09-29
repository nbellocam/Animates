/*global Raphael, window */

// var Animates = Animates || {};

// (function (ns){
// 	//This class should contain the paper and the list of elements
// 	var canvas = function(elementId, width, height) {
// 		this.paper = Raphael(document.getElementById(elementId), width, height);
// 		this.objectsList = [];
// 	};

// 	//This is a temporal method. This should change to drawElement = function (id, element)
// 	canvas.prototype.drawCircle = function(id, x, y, radius) {
// 		this.objectsList.push( {id : id, element : this.paper.circle(x, y, radius) });
// 	};

// 	ns.Canvas = canvas;

// })(Animates);


var Animates = Animates || {};

(function (ns){
	//This class should contain the paper and the list of elements
	var canvas = function(elementId, width, height) {
		this.paper = new fabric.Canvas(elementId);
		this.paper.setHeight(height);
		this.paper.setWidth(width);
		this.objectsList = [];
	};

	//This is a temporal method. This should change to drawElement = function (id, element)
	canvas.prototype.drawRect = function(id, x, y, width, height) {
		// create a rectangle object
		var rect = new fabric.Rect({
		  left: x,
		  top: y,
		  fill: 'red',
		  width: width,
		  height: height
		});

		// "add" rectangle onto canvas
		this.paper.add(rect);

		this.objectsList.push( {id : id, element : rect });
	};

	ns.Canvas = canvas;

})(Animates);

window.onload = function (){
	var canvasContainer = $('.canvasContainer');
	var canvas = new Animates.Canvas('canvas', canvasContainer.width(), canvasContainer.height());
	canvas.drawRect('myRect',100,100,20,20);
	canvas.drawRect('myRect',200,300,50,50);
};