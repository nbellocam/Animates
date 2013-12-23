var Animates = {};

(function (ns){

  /**
   *  Creates a new Animation.
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


window.onload = function (){
	var canvas = new fabric.Canvas('mainCanvas');

  // TODO update width and height to the size of the screen.
	canvas.setHeight(500);
	canvas.setWidth(800);


	var rect = new fabric.Rect({
		 	left: 50, top: 50, fill: 'red', width: 70, height: 150
		});

	rect.id = "Hola mundo";

	canvas.add(rect);

	canvas.on('object:modified', function(options) {
	  if (options.target) {
	    console.log('an object was clicked! ', options.target.type);
	  }
	});

	rect.set('angle', 45);
}