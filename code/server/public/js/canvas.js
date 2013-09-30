/*global Raphael, window */

var Animates = Animates || {};

(function (ns){
	//This class should contain the paper and the list of elements
	var canvas = function(elementId, width, height, isStatic) {
		this.paper = (isStatic) ? new fabric.StaticCanvas(elementId) : new fabric.Canvas(elementId);
		this.paper.setHeight(height);
		this.paper.setWidth(width);
	};

	canvas.prototype.drawRect = function(x, y, width, height) {
		var rect = new fabric.Rect({
		  left: x, top: y, fill: 'red', width: width, height: height
		});

		this.paper.add(rect);
	};

	canvas.prototype.drawCircle = function(x, y, radius) {
		var rect = new fabric.Circle({
		  left: x, top: y, fill: 'red', radius: radius
		});

		this.paper.add(rect);
	};

	canvas.prototype.drawTriangle = function(x, y, width, height) {
		var rect = new fabric.Triangle({
		  left: x, top: y, fill: 'red', width: width, eight: height
		});

		this.paper.add(rect);
	};

	canvas.prototype.exportToJsonString = function (){
		return JSON.stringify(this.paper);
	}

	canvas.prototype.loadFromJsonString = function (jsonCanvas){
		this.paper.loadFromJSON(jsonCanvas);
	}

	canvas.prototype.clearCanvas = function (){
		this.paper.clear().renderAll();
	}
	
	canvas.prototype.renderAll = function (){
		this.paper.renderAll();
	}

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

		toolbar.find('#clear').click(function(){ canvasToolbar.clearCanvas(); });
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
		$('#output').text(this.canvasElement.exportToJsonString());
	};

	toolbar.prototype.clearCanvas = function() {
		this.canvasElement.clearCanvas();
	};
	
	ns.Toolbar = toolbar;

})(Animates);

window.onload = function (){
	var canvasContainer = $('#editableCanvasContainer');
	window.canvas = new Animates.Canvas('canvas', canvasContainer.width(), canvasContainer.height(), false);
	window.staticCanvas = new Animates.Canvas('static-canvas', canvasContainer.width(), canvasContainer.height(), true);
	
	$('#staticCanvasContainer').hide();

	window.canvasToolbar = new Animates.Toolbar('#topToolbarMenu',canvas);

	window.canvas.drawRect(100,100,20,20);

	var staticButton = $('#staticCanvasBtn');
	var editableButton = $('#editableCanvasBtn');
	staticButton.click(function (){
		editableButton.parent().removeClass('active');
		staticButton.parent().addClass('active');

		$('#editableCanvasContainer').hide();
		$('#topToolbarMenu').hide();
		$('#output').hide();
		
		var jsonCanvas = window.canvas.exportToJsonString();
		window.canvas.clearCanvas();
		window.staticCanvas.loadFromJsonString(jsonCanvas);
		window.staticCanvas.renderAll();

		$('#staticCanvasContainer').show();
	});

	editableButton.click(function (){
		staticButton.parent().removeClass('active');
		editableButton.parent().addClass('active');

		$('#staticCanvasContainer').hide();

		var jsonCanvas = window.staticCanvas.exportToJsonString();
		window.staticCanvas.clearCanvas();
		window.canvas.loadFromJsonString(jsonCanvas);
		window.canvas.renderAll();

		$('#editableCanvasContainer').show();
		$('#topToolbarMenu').show();
		$('#output').show();
	});
};