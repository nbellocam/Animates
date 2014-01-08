'use strict';

/**
 *  Creates a new Canvas.
 *  @class Represents a Canvas. 
 */
function Canvas (options) {
	options = options || {};
	
	var _self = this; // Save the this reference for later use

	this.height = options.height || 100;
	this.width = options.width || 100;
	this.backgroundColor = options.backgroundColor || 'white';
	this.backgroundImage = options.backgroundImage || '';

	this.viewport = options.viewport || {};

	this.updateViewport = function updateViewport(viewportPorcentage, topPorcentage, leftPorcentage){
		_self.viewport.height = _self.height * viewportPorcentage;
		_self.viewport.width = _self.width * viewportPorcentage;
		_self.viewport.top = _self.height * topPorcentage;
		_self.viewport.left = _self.width * leftPorcentage;

		return _self.viewport;
	};

	/**
	 *  Constructor
	 */
	(function init() {
		if (! _self.height || ! _self.width){
			_self.updateViewport(0.8, 0.1 ,0.1);
		}
	}());
}

module.exports = Canvas;
