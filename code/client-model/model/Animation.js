/*global window, fabric, $ */

var Animates = Animates || {};

(function (ns){

	/**
	 *	Creates a new Animation.
	 *  @class Represents an Animation . 
	 */ 
	var Animation = function (options) 
	{
		var $this = this; // Save the this reference for later use

		this.startFrame = options.startFrame || 0;

		this.endFrame = options.endFrame || -1;
		
		/**
		 * Calculates the new shape properties based on the original ones and the actual frame.
		 * @param {integer} frame The actual frame.
		 * @param {object} originalProperties The original properties.
		 */
		this.getPropertiesForFrame = function (frame, originalProperties) 
		{
		};

		(function init() {
		})();

	};

	ns.Animation = Animation;

})(Animates);
