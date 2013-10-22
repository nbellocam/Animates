/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var moduleExport = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new ShapeFrame.
	 *  @class Represents a ShapeFrame . 
	 */
	var ShapeFrame = function (options) {
		var $this = this; // Save the this reference for later use

		/**
		 *  Constructor
		 */
		(function init() {
		}());
	};

	ns.ShapeFrame = ShapeFrame;

})(moduleExport);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = moduleExport.ShapeFrame;
} else {
	window.ShapeFrame = moduleExport.ShapeFrame;
}
