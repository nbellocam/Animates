/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var moduleExport = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new Canvas.
	 *  @class Represents a Canvas. 
	 */
	var Canvas = function (options) {
		var $this = this; // Save the this reference for later use

		// TODO

		/**
		 *  Constructor
		 */
		(function init() {
		}());
	};
	
	ns.Canvas = Canvas;

})(moduleExport);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = moduleExport.Canvas;
} else {
	window.Canvas = moduleExport.Canvas;
}
