/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var moduleExport = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new SoundManager.
	 *  @class Represents a SoundManager. 
	 */
	var SoundManager = function (options) {
		var $this = this; // Save the this reference for later use

		// TODO define this class

		/**
		 *  Constructor
		 */
		(function init() {
		}());
	};

	ns.SoundManager = SoundManager;

})(moduleExport);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = moduleExport.SoundManager;
} else {
	window.SoundManager = moduleExport.SoundManager;
}
