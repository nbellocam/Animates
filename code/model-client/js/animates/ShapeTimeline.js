/*global window, fabric, $ */

var Animates = Animates || {};

(function (ns){

	/**
	 *	Creates a new ShapeTimeline.
	 *  @class Represents a ShapeTimeline. 
	 */ 
	var ShapeTimeline = function (options) 
	{
		var $this = this, // Save the this reference for later use
			shape = options.shape;
			initialFrame = options.initialFrame || 0;
			animations = [];


		/**
		 * Calculates the shape based on the original properties and the actual frame.
		 * @param {integer} frame The actual frame.
		 */
		this.getShapeForFrame = function (frame) 
		{
		};

		this.getInitialFrame = function (){
			return initialFrame;
		};

		this.getEndFrame = function (){
			var endFrame = -1;

			for (var i = animations.length - 1; i >= 0; i--) {
				var animationEndFrame = animations[i].endFrame;
				if (animationEndFrame > endFrame){
					endFrame = animationEndFrame;
				}
			};
			return endFrame;
		};

		/**
		 *	Constructor
		 */ 
		(function init() {
		})();

	};

	ns.ShapeTimeline = ShapeTimeline;

})(Animates);

