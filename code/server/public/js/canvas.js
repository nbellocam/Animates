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
	};

	canvas.prototype.drawRect = function(x, y, width, height) {
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
	};

	canvas.prototype.drawCircle = function(x, y, radius) {
		var rect = new fabric.Circle({
		  left: x,
		  top: y,
		  fill: 'red',
		  radius: radius,
		});

		this.paper.add(rect);
	};

	canvas.prototype.drawTriangle = function(x, y, width, height) {
		var rect = new fabric.Triangle({
		  left: x,
		  top: y,
		  fill: 'red',
		  width: width,
		  height: height
		});

		this.paper.add(rect);
	};

	ns.Canvas = canvas;

})(Animates);

(function (ns){
	var toolbar = function(elementId, canvasElement) {
		this.canvasElement = canvasElement;
		var toolbar = $(elementId);

		toolbar.find('#rect').click(function(){ canvasToolbar.addRect(); });
		toolbar.find('#circle').click(function(){ canvasToolbar.addCircle(); });
		toolbar.find('#triangle').click(function(){ canvasToolbar.addTriangle(); });
		//toolbar.find('#image').click(this.addImage());

		toolbar.find('#json').click(function(){ canvasToolbar.exportToJson(); });
	};

	toolbar.prototype.addRect = function() {
		this.canvasElement.drawRect(50,50,100,100);
	};

	toolbar.prototype.addCircle = function() {
		this.canvasElement.drawCircle(50,50,30);
	};

	toolbar.prototype.addTriangle = function() {
		this.canvasElement.drawTriangle(50,50,100,100);
	};

	toolbar.prototype.exportToJson = function() {
		$('#output').text(JSON.stringify(this.canvasElement));
	};

	ns.Toolbar = toolbar;

})(Animates);

window.onload = function (){
	var canvasContainer = $('.canvasContainer');
	window.canvas = new Animates.Canvas('canvas', canvasContainer.width(), canvasContainer.height());
	window.canvasToolbar = new Animates.Toolbar('#topToolbarMenu',canvas);


	window.canvas.drawRect(100,100,20,20);
};