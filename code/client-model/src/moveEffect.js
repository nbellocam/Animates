/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

//var Common = require('animates-common').Common;

var moduleExport = {};

(function (ns) {
	'use strict';

	/**
	 *  Creates a new Effect.
	 *  @class Represents an Effect . 
	 */
	var moveEffect = function (options) {
		options = options || {};

		var _self = this, // Save the this reference for later use
		path = options.path || { getPositionFor: function(startFrame, endFrame, currentFrame) { return { x:0, y:0 }; } };

		/**
		 * Calculates the new shape properties based on the original ones and the actual frame.
		 * @param {integer} frame The actual frame.
		 * @param {object} originalProperties The original properties.
		 */
		this.getPropertiesForFrame = function (frame, beginShapeFrame) {
			var currentPos = path.getPositionFor(startFrame, endFrame, frame);
			beginShapeFrame.x = currentPos.x;
			beginShapeFrame.y = currentPos.y;
			return beginShapeFrame;
		};

		(function init() {
		}());
	};

	//Common.inherits(InheritedClass, Effect);

	ns.moveEffect = moveEffect;

})(moduleExport);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = moduleExport.moveEffect;
} else {
	window.moveEffect = moduleExport.moveEffect;
}
