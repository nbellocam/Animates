!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.model=e():"undefined"!=typeof global?global.model=e():"undefined"!=typeof self&&(self.model=e())}(function(){var define,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Creates an object that represents the structure of a js namespace
 * 
 * @memberof animates.common
 * @param {string} namespaceString The namespace hierarchy separated by dots i.e 'App.model'.
 */
function namespace (namespaceString) {
	var parts = namespaceString.split('.'),
		parent = window,
		currentPart = '';

	for(var i = 0, length = parts.length; i < length; i++) {
		currentPart = parts[i];
		parent[currentPart] = parent[currentPart] || {};
		parent = parent[currentPart];
	}

	return parent;
}

/**
 *  Gets the real type of an object
 *
 *  @memberof animates.common
 *  @param {Object} o The object we want to know the type of
 */
function typeOf (o) {
	if (o === null || o === undefined || o.constructor === null || o.constructor === undefined)
	{
		return null;
	}

	var s = Object.prototype.toString.call(o).match(/^\[object (.*)\]$/)[1].toLowerCase(),
		supDataTypes = ['array', 'string', 'function', 'number', 'date', 'boolean', 'object'];

	s = (supDataTypes.indexOf(s) === -1) ? ((s.indexOf('html') === -1) ? 'object' : 'dom') : s;

	return s;
}

/**
 * Deep extends missing properties from source properties with default values
 * @param  {Object} source		The current object to be extended
 * @param  {Object} defaults	The default values
 * @return {Object}             The extended object with default values
 */
function extend (source, defaults) {
	for (var property in defaults) {
		if (defaults[property] && defaults[property].constructor &&
			defaults[property].constructor === Object) {
			source[property] = source[property] || {};
			arguments.callee(source[property], defaults[property]);
		} else {
			if (typeof source[property] === 'undefined'){
				source[property] = defaults[property];
			}
		}
	}
	return source;
}

/**
 *  Creates an inherited class of a given parent
 *
 *	@memberof animates.common
 *  @param {Object} descendant The child to make inherit 
 *  @param {Object} parent The parent where to inherit from 
 */
function inherits (descendant, parent, parentName) 
{
	var sConstructor = parent.constructor.toString().toLowerCase(),
		aMatch = sConstructor.match( /\s*function (.*)\(/ ); 
	
	if ( aMatch !== null ) 
	{
		if ( aMatch[1] === '' || aMatch[1] === 'function' ) 
		{
			if ( typeof(parentName) === 'undefined' )
			{
				descendant.prototype.base = parent;
			}
			else
			{
				descendant.prototype[parentName] = parent;
			}
		}
		else
		{	
			descendant.prototype[aMatch[1].replace(/^\s*|\s*$/g,"")] = parent;
		} 
	} 

	for (var m in parent.prototype) 
	{
		if ( m !== 'base' ) descendant.prototype[m] = parent.prototype[m]; 
	}
}

/**
 *  Gets a clone from a given object
 *
 *  @memberof animates.common
 *  @param {Object} o The object we want to clone
 *  @return The clone of the object
 */
function clone(obj) {
	var copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * Private method: Gets a new GUID string. More information at: https://gist.github.com/jed/982883
 * 
 * @memberof animates.common
 * @return The new short GUID
 */
function b(a){
	return a ? (a^Math.random()*16>>a/4).toString(16) : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b);
}

/**
 * Gets a new GUID string
 *
 * @memberof animates.common
 * @return The new GUID (without braces)
 */
function createGuid ()
{
	return b();
}

exports.namespace = namespace;
exports.typeOf = typeOf;
exports.inherits = inherits;
exports.createGuid = createGuid;
exports.extend = extend;
exports.clone = clone;

},{}],2:[function(require,module,exports){
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


	this.filterDrawables = function filterDrawables(mediaFrames){
		return mediaFrames; //TODO filter media frames
	};
	
	/**
	 *  Constructor
	 */
	(function init() {
	}());
}

module.exports = Canvas;

},{}],3:[function(require,module,exports){
'use strict';

var Common = require('animates-common');

/**
 *  Creates a new Effect.
 *  @class Represents an Effect . 
 */
function Effect (options) {
	options = options || {};

	var _self = this,
		guid = ''; // Save the this reference for later use

	this.startTick = options.startTick || 0;

	this.endTick = options.endTick || -1;

	/**
	 * Calculates the new shape properties based on the original ones and the current tick.
	 * @param {integer} tick The current tick number.
	 * @param {object} originalProperties The original properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		return mediaFrameProperties;
	};

	/**
	 * Gets the guid of the effect
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		guid = Common.createGuid();
	}());
}

module.exports = Effect;

},{"animates-common":1}],4:[function(require,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var Common = require('animates-common'),
	Effect = require('../effect.js');



/**
 *  Creates a new MoveEffect.
 *  @class Represents an MoveEffect . 
 */
function MoveEffect(options) {
	options = options || {};

	this.base(options);
	
	var _self = this,
		path = options.path;

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var startTick = _self.startTick,
			endTick = _self.endTick;

		if (tick >= startTick){
			if (typeof path !== 'undefined' && typeof path.getPositionFor === 'function' ) {
				var currentPos;

				if (endTick === -1){
					currentPos = path.getPositionFor(startTick, endTick, tick);
				} else {
					currentPos = path.getPositionFor(startTick, endTick, (tick < endTick) ? tick : endTick);
				}

				if (typeof currentPos.x !== 'undefined' ){
					mediaFrameProperties.position.x = currentPos.x;
				}

				if (typeof currentPos.y !== 'undefined' ){
					mediaFrameProperties.position.y = currentPos.y;
				}
			}
		}

		return mediaFrameProperties;
	};

	(function init() { 
		
	}());
}

Common.inherits(MoveEffect, Effect);

module.exports = MoveEffect;

},{"../effect.js":3,"animates-common":1}],5:[function(require,module,exports){
'use strict';

var Common = require('animates-common'),
	MediaObject = require('./mediaObject');

/**
 *  Creates a new MediaFrame.
 *  @class Represents the specific frame of a media object. 
 *  @param {object} options the constructor options.
 *  @param {MediaObject} options.mediaObject the frame mediaObject reference.
 *  @param {integer} options.currentTick the current tick number which is represented by the instance.
 */
function MediaFrame (options) {
	var _self = this,
		defaultOptions = {
			currentTick : -1,
			mediaObject : null
		},
		currentOptions,
		currentProperties;

	/**
	 * Sets or gets the properties
	 * @param  {object} [values] The new properties values to be set (it can be a subset of the propeties. Missing properties will remain as untouched)
	 * @return {object} The properties object with its current values
	 */
	this.properties = function properties (values) {
		if (values) {
			currentProperties = Common.extend(values, currentProperties);
		} else {
			return currentProperties;
		}
	};

	/**
	 *  Constructor
	 */
	(function init() {
		currentOptions = Common.extend(options || {}, defaultOptions),
		currentProperties = currentOptions.mediaObject.getProperties();
	}());
}

module.exports = MediaFrame;

},{"./mediaObject":6,"animates-common":1}],6:[function(require,module,exports){
'use strict';

var Common = require('animates-common');

/**
 *  Creates a new MediaObject
 *  @class Represents a MediaObject. 
 */
function MediaObject (options) {
	var _self = this,
		guid = '',
		properties = options || {};

	/**
	 * Get the properties
	 * @return {Object} The current properties
	 */
	this.getProperties = function getProperties()
	{
		return Common.clone(properties);
	};

	/**
	 * Get the properties
	 * @return {Object} The current properties
	 */
	this.getProperty = function getProperties(name)
	{
		if (name){
			var parts = name.split('.'),
			parent = properties,
			currentPart = '',
			length = parts.length;

			for(var i = 0; i < length && parent; i++) {
				currentPart = parts[i];
				parent = parent[currentPart] || undefined;
			}

			return parent;
		}

		return undefined;
	};

	/**
	 * Set the property named after the first parameter value 
	 * @return {Object} The current properties
	 */
	this.setProperty = function setProperty(name, value)
	{
		if (name){
			var parts = name.split('.'),
			parent = properties,
			oldParent,
			currentPart = '',
			length = parts.length;

			for(var i = 0; i < length; i++) {
				currentPart = parts[i];
				oldParent = parent;
				oldParent[currentPart] = parent[currentPart] || {};
				parent = oldParent[currentPart];
			}

			oldParent[currentPart] = value;
		}
	};

	/**
	 * Gets the guid of the MediaObject
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
		guid = Common.createGuid();
	}());
}

module.exports = MediaObject;
},{"animates-common":1}],7:[function(require,module,exports){
'use strict';

var MediaFrame = require('./mediaFrame');

/**
 *  Creates a new media timeline.
 *  @class Represents a timeline for a media object. 
 */
function MediaTimeline (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		mediaObject = options.mediaObject,
		startTick = options.startTick || 0,
		endTick = options.endTick || -1,
		effects = {};


	/**
	 * Calculates the media object based on the original properties and the current tick.
	 * @param {integer} currentTick The current tick.
	 */
	this.getMediaFrameFor = function getMediaFrameFor(currentTick) {
		if (startTick <= currentTick){
			var mediaObjectFrame = new MediaFrame({ 'mediaObject' : mediaObject, 'currentTick' : currentTick }),
				effectsArray = [],
				currentEffect;

			for (var id in effects) {
				if (effects.hasOwnProperty(id)) {
					effectsArray.push(effects[id]);
				}
			}

			effectsArray.sort(function(a,b){
				return b.endTick - a.endTick;
			});
			
			for (var i = effectsArray.length - 1; i >= 0; i--) {
				currentEffect = effectsArray[i];
				if (currentTick >= currentEffect.startTick){
					if (currentEffect.endTick === -1 ){
						mediaObjectFrame.properties(currentEffect.getProperties(currentTick, mediaObjectFrame.properties()));
					} else {
						mediaObjectFrame.properties(
							currentEffect.getProperties(
								(currentTick < currentEffect.endTick) ? currentTick : currentEffect.endTick,
								mediaObjectFrame.properties()
							)
						);
					}
				}
			}

			return mediaObjectFrame;
		}
		return undefined;
	};

	/**
	 * Get the media object id
	 * @return {string} The media object id.
	 */
	this.getMediaObjectId = function getMediaObjectId() {
		return mediaObject.getGuid();
	};

	/**
	 * Get the start tick
	 * @return {integer} The number of the start tick.
	 */
	this.getStartTick = function getStartTick() {
		return startTick;
	};

	/**
	 * Set the start tick for this media object
	 * @param {integer} tick The start tick for this media object.
	 */
	this.setStartTick = function setStartTick(tick) {
		startTick = tick;
	};

	/**
	 * Calculates the end tick based on the effects and the configured end tick.
	 * @return {integer} The number of the end tick.
	 */
	this.getEndTick = function getEndTick() {
		var currentEndTick = endTick,
			effectEndTick;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectEndTick = effects[id].endTick;
				if (effectEndTick > currentEndTick){
					currentEndTick = effectEndTick;
				}
			}
		}

		return currentEndTick;
	};

	/**
	 * Set the end tick for this media object
	 * @param {integer} tick The end tick for this media object.
	 */
	this.setEndTick = function setEndTick(tick) {
		endTick = tick;
	};

	/**
	 * Add a new effect to the media object timeline.
	 * @param {Effect} effect the effect that will be added.
	 */
	this.addEffect = function addEffect(effect){
		if (effect) {
			effects[effect.getGuid()] = effect;
		}
	};

	/**
	 * Remove the effect from the media object timeline that correspond to the effectId
	 * @param  {string} effectId The id that was used when the effect was added.
	 */
	this.removeEffect = function removeEffect(effectId){
		if (effectId) {
			delete effects[effectId];
		}
	};

	/**
	 * Return the collection of effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffects = function getEffects(){
		return effects;
	};

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

module.exports = MediaTimeline;

},{"./mediaFrame":5}],8:[function(require,module,exports){
'use strict';

var model = {
	// Core
	MediaObject : require('./mediaObject'),
	VisualMediaObject : require('./visualMediaObject'),
	Effect : require('./effect'),
	Timeline : require('./timeline'),
	MediaTimeline : require('./mediaTimeline'),
	MediaFrame : require('./mediaFrame'),
	Canvas : require('./canvas'),

	// media objects
	Shape : require('./shape'),
	Rectangle : require('./shapes/rectangle'),
	Photo : require('./photo'),
	Sound : require('./sound'),

	// effects
	MoveEffect : require('./effects/moveEffect'),
	Path : require('./utils/path'),
};

 module.exports = model;
},{"./canvas":2,"./effect":3,"./effects/moveEffect":4,"./mediaFrame":5,"./mediaObject":6,"./mediaTimeline":7,"./photo":9,"./shape":10,"./shapes/rectangle":11,"./sound":12,"./timeline":13,"./utils/path":14,"./visualMediaObject":15}],9:[function(require,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Photo
 *  @class Represents a Photo. 
 */
function Photo (options) {
	var _self = this,
		defaultProperties = {
			source : ''
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.VisualMediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Photo, VisualMediaObject, 'VisualMediaObject');

module.exports = Photo;

},{"./visualMediaObject":15,"animates-common":1}],10:[function(require,module,exports){
'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape. 
 */
function Shape (options) {
	var _self = this,
		properties = options || {};
	
	this.VisualMediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Shape, VisualMediaObject, 'VisualMediaObject');

module.exports = Shape;

},{"./visualMediaObject":15,"animates-common":1}],11:[function(require,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = require('../shape'),
	Common = require('animates-common');

/**
 *  Creates a new Rectangle
 *  @class Represents a Rectangle. 
 */
function Rectangle (options) {
	var _self = this,
		defaultProperties = {
			height : 100,
			width : 100
		},
		properties = Common.extend(options || {}, defaultProperties);
	this.Shape(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

module.exports = Rectangle;

},{"../shape":10,"animates-common":1}],12:[function(require,module,exports){
'use strict';

var MediaObject = require('./mediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new Sound
 *  @class Represents a Sound. 
 */
function Sound (options) {
	var _self = this,
		defaultProperties = {
			volumen : 100,
			source : ''
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.MediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(Sound, MediaObject, 'MediaObject');

module.exports = Sound;
},{"./mediaObject":6,"animates-common":1}],13:[function(require,module,exports){
'use strict';

var MediaTimeline = require('./mediaTimeline');

/**
 *  Creates a new Timeline
 *  @class Represents a Timeline. 
 */
function Timeline (options) {
	var _self = this,
		mediaTimelineCollection = [];

	/**
	 * Add a new media timeline element related with the media object passed by parameter
	 * @param {object} mediaObject the media object to be added.
	 * @return {object} The corresponding mediaTimeline object
	 */
	this.addMediaObject = function addMediaObject(mediaObject) {
		// Generate a new MediaTimeline using the mediaObject data.
		if (mediaObject !== undefined){
			var mediaTimeline,
				i,
				mediaObjectId = mediaObject.getGuid();

			for (i = mediaTimelineCollection.length - 1; i >= 0 && !mediaTimeline; i--) {
				if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId){
					mediaTimeline = mediaTimelineCollection[i];
				}
			}

			if (!mediaTimeline){
				mediaTimeline = new MediaTimeline({ mediaObject : mediaObject });
				mediaTimelineCollection.push(mediaTimeline);
			}

			return mediaTimeline;
		}
	};

	/**
	 * Remove a media object element and its related media timeline.
	 * @param {string} mediaObjectId the id of the media object element that will be removed.
	 */
	this.removeMediaObject = function removeMediaObject(mediaObjectId) {
		var i;
		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId){
				mediaTimelineCollection.splice(i, 1);
			}
		}
	};

	/**
	 * Return the media timeline element related to the media object id passed by parameter
	 * @param  {string} mediaObjectId the if of the media object 
	 * @returns {MediaTimeline} the media timeline related to the media object id passed by parameter
	 */
	this.getMediaTimeline = function getMediaTimeline(mediaObjectId) {
		var current, i;

		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			current = mediaTimelineCollection[i];
			if (current.getMediaObjectId() === mediaObjectId){
				return current;
			}
		}

		return undefined;
	};

	/**
	 * Returns the amount of media timelines in this timeline
	 * @return {integer} The amount of media timelines in this timeline
	 */
	this.countMediaTimelines = function countMediaTimelines() {
		return mediaTimelineCollection.length;
	};

	/**
	 * Remove all the elements in the timeline
	 */
	this.clearAllElements = function clearAllElements() {
		mediaTimelineCollection.length = 0;
	};

	/**
	 * Calculates all the elements for the current tick number.
	 * @param {integer} currentTick The current tick number.
	 */
	this.getElements = function getElements(currentTick) {
		var elements = [], i;
		
		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			elements.push(mediaTimelineCollection[i].getMediaFrameFor(currentTick));
		}

		return elements;
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());

}

module.exports = Timeline;
},{"./mediaTimeline":7}],14:[function(require,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

/**
 *  Creates a new Path.
 *  @class Represents an Path . 
 */
function Path (options) {
	options = options || {};

	var _self = this; // Save the this reference for later use

	this.startPosition = options.startPosition || { x: 0, y:0 };

	this.endPosition = options.endPosition || { x: 0, y:0 };

	/**
	 * Calculates the new position based on the the currentTick, the start and end ticks and the start and end position.
	 * @param {integer} startTick The start tick number.
	 * @param {integer} endTick The end tick number.
	 * @param {integer} currentTick The current tick number.
	 * @returns {object} The postion {x, y} for the current tick
	 */
	this.getPositionFor = function (startTick, endTick, currentTick) {
		if (startTick > currentTick){
			return {}; // The position can't be determined
		}

		var startX = _self.startPosition.x,
			startY = _self.startPosition.y,
			endX = _self.endPosition.x,
			endY = _self.endPosition.y;

		if (endTick === -1){
			var tickDelta = currentTick - startTick,
				currentXPosition,
				currentYPosition,
				finalXPosition,
				finalYPosition;

			if (startX === endX){
				finalXPosition = startX;
			} else if (startX < endX){
				currentXPosition = startX + tickDelta;
				finalXPosition = currentXPosition >= endX ? endX : currentXPosition;
			} else {
				currentXPosition = startX - tickDelta;
				finalXPosition = currentXPosition <= endX ? endX : currentXPosition;
			}

			if (startY === endY){
				finalYPosition = startY;
			} else if (startY < endY){
				currentYPosition = startY + tickDelta;
				finalYPosition = currentYPosition >= endY ? endY : currentYPosition;
			} else {
				currentYPosition = startY - tickDelta;
				finalYPosition = currentYPosition <= endY ? endY : currentYPosition;
			}

			return { x: finalXPosition, y: finalYPosition };
		}

		if (endTick <= currentTick){
			return { 'x' : endX, 'y' : endY };		
		}

		var ticksAmount = endTick - startTick,
			currentPathPercentage = (currentTick - startTick) / ticksAmount,
			xDelta = (endX - startX) * currentPathPercentage,
			yDelta = (endY - startY) * currentPathPercentage;

		return { 'x' : startX + xDelta, 'y' : startY + yDelta};
	};

	(function init() {
	}());
}

module.exports = Path;

},{}],15:[function(require,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var MediaObject = require('./mediaObject'),
	Common = require('animates-common');

/**
 *  Creates a new VisualMediaObject
 *  @class Represents a Shape. 
 */
function VisualMediaObject (options) {

	var _self = this,
		defaultProperties = {
			position : {
				x : 0,
				y : 0,
				z : 0
			},
			opacity: 1,
			border : {
				type : 'none',
				color : 'black'
			},
			fill : 'black',
			angle : 0,
		},
		properties = Common.extend(options || {}, defaultProperties);

	this.MediaObject(properties); // Call base constructor

	/**
	 *  Constructor
	 */ 
	(function init() {
	}());
}

Common.inherits(VisualMediaObject, MediaObject, 'MediaObject');

module.exports = VisualMediaObject;

},{"./mediaObject":6,"animates-common":1}]},{},[8])
(8)
});
;