/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

/**
 *  Creates a new Shape
 *  @class Represents a Shape. 
 */
function Shape (options) {
	var _self = this; // Save the this reference for later use

	this.Rect = {
		shapeId : "rect",
		width : 50,
		height : 50,
		fillColor : "#FFFFFF",
		borderColor : "#FFFFFF",
		borderSize : 2
	};

	this.Circle = {
		shapeId : "circle",
		radius : 50,
		fillColor : "#FFFFFF",
		borderColor : "#FFFFFF",
		borderSize : 2
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

module.exports = Shape;
