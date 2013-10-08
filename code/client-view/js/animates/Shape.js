/*global window, fabric, $ */

var Animates = Animates || {};

(function (ns){

	/**
	 *	Creates a new Shape
	 *  @class Represents a Shape . 
	 */ 
	var Shape = function (options) 
	{
		var $this = this, // Save the this reference for later use

		this.Rect = {
			shapeId = "rect"
			width = 50;
			height = 50;
			fillColor = "#FFFFFF"
			borderColor = "#FFFFFF"
			borderSize = 2;
		};

		this.Circle = {
			shapeId = "circle"
			radius = 50;
			fillColor = "#FFFFFF"
			borderColor = "#FFFFFF"
			borderSize = 2;
		};

		/**
		 *	Constructor
		 */ 
		(function init() {
		})();

	};	
	ns.Shape = Shape;

})(Animates);

