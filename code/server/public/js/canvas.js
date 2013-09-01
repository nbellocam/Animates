var Animates = Animates || {};

(function (ns){
	//This class should contain the paper and the list of elements
	var canvas = function(elementId, width, height) {
		this.paper = Raphael(document.getElementById(elementId), width, height);
		this.objectsList = [];
	};

	//This is a temporal method. This should change to drawElement = function (id, element)
	canvas.prototype.drawCircle = function(id, x, y, radius) {
		this.objectsList.push( {id : id, element : this.paper.circle(x, y, radius) });
	}

	ns.Canvas = canvas;

})(Animates);

window.onload = function (){
	var canvas = new Animates.Canvas('canvas', 500,500);
	canvas.drawCircle('myCircle',100,100,80);
};