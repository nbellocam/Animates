/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var moduleExport = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new PresentationPlayer.
	 *  @class Represents a PresentationPlayer. 
	 */
	var PresentationPlayer = function (options) {
		var $this = this; // Save the this reference for later use

		// TODO

		/**
		 *  Constructor
		 */
		(function init() {
		}());
	};
	
	ns.PresentationPlayer = PresentationPlayer;

})(moduleExport);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = moduleExport.PresentationPlayer;
} else {
	window.PresentationPlayer = moduleExport.PresentationPlayer;
}
