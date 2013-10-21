/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

var moduleExport = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new Animation.
	 *  @class Represents an Animation . 
	 */
	var Animation = function (options) {
		options = options || {};

		var $this = this; // Save the this reference for later use

		this.startFrame = options.startFrame || 0;

		this.endFrame = options.endFrame || -1;

		/**
		 * Calculates the new shape properties based on the original ones and the actual frame.
		 * @param {integer} frame The actual frame.
		 * @param {object} originalProperties The original properties.
		 */
		this.getPropertiesForFrame = function (frame, beginShapeFrame) {
			//var shapeFrame = ns.clone (beginShapeFrame)
			//return $this.updateFrame (shapeFrame); --> template method
			return beginShapeFrame; //This should be a copy
		};

		(function init() {
		}());
	};

	ns.Animation = Animation;

})(moduleExport);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = moduleExport.Animation;
} else {
	window.Animation = moduleExport.Animation;
}
