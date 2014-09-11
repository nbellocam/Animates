!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.model=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
 * returns the real type for function constructors
 * @param  {Object} obj		The current function to get the type
 * @return {string}			The name of the constructor
 */
function realTypeOf(obj) {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((obj).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
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
			if (typeof source[property] === 'undefined') {
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
function b(a) {
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

/**
 * Gets a list of keys from an object
 *
 * @memberof animates.common
 * @return list of keys from the object passed by param
 */
function getKeysFromObject(object)
{
  var list = [];

	if (object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				list.push(key);
			}
		}
	}

  return list;
}

/**
 * Gets a new list filtered by a list of elements passed by parameter.
 *
 * @memberof animates.common
 * @return the new filtered list
 */
function filterArray(originalArray, listOfFilterElements) {
  var result = [];

  for(var i = 0; i < originalArray.length; i++) {
    var element = originalArray[i];
    if (!listOfFilterElements || listOfFilterElements.indexOf(element) === -1) {
      result.push(element);
    }
  }

  return result;
}

/**
 * Gets a new object filtered by a list of elements passed by parameter.
 *
 * @memberof animates.common
 * @return the new filtered object
 */
function filterObject(originalObject, listOfFilterKeys, included) {
  var result = {};

  for (var key in originalObject) {
    if (originalObject.hasOwnProperty(key) &&
			((!included && (!listOfFilterKeys || listOfFilterKeys.indexOf(key) === -1)) || 
			(included && listOfFilterKeys && listOfFilterKeys.indexOf(key) !== -1))) {
				result[key] = originalObject[key];
    }
  }

  return result;
}


/**
 * Check if an object is an empty object({}).
 *
 * @memberof animates.common
 * @return true if the object is an empty object.
 */
function isEmpty(obj) {
	if (obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				return false;
			}
		}
	}

  return true;
}

exports.namespace = namespace;
exports.typeOf = typeOf;
exports.inherits = inherits;
exports.createGuid = createGuid;
exports.extend = extend;
exports.clone = clone;
exports.realTypeOf = realTypeOf;
exports.getKeysFromObject = getKeysFromObject;
exports.filterArray = filterArray;
exports.filterObject = filterObject;
exports.isEmpty = isEmpty;

},{}],2:[function(_dereq_,module,exports){
'use strict';

var Canvas = _dereq_('./canvas'),
	Timeline = _dereq_('./timeline'),
	MediaTimeline = _dereq_('./mediaTimeline'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Animation.
 *  @class Represents an Animation.
 */
function Animation (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		updateObservers = {},
		loadCompleteObservers = {};

	/**
	*  Constructor
	*/
	(function preInit() {
		_self.canvas = options.canvas || new Canvas();
		_self.timeline = options.timeline || new Timeline();
	}());

	function getResultObject () {
		return { status : false, data : {} };
	}

	function applyShapeCreateOperation(opParams) {
		var mediaTimeline,
			result = getResultObject();

		mediaTimeline = _self.timeline.addMediaObject(opParams.mediaObject);

		if (mediaTimeline) {
			result.status = true;
			result.data = opParams;
			result.data.mediaTimeline = mediaTimeline;
			result.target = 'MediaTimeline';
		}

		return result;
	}

	function applyShapeRemoveOperation(opParams) {
		var mediaTimeline = new MediaTimeline(),
			result = getResultObject();

		if (_self.timeline.getMediaTimeline(opParams.mediaObjectId)) {
			_self.timeline.removeMediaObject(opParams.mediaObjectId);
			result.status = true;
			result.data = opParams;
			result.target = 'MediaTimeline';
		}

		return result;
	}

	function applyMediaTimelineCreateOperation(opParams) {
		var mediaTimeline,
			result = getResultObject();

		mediaTimeline = _self.timeline.addMediaTimeline(opParams.mediaTimeline);

		if (mediaTimeline) {
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyMediaTimelineRemoveOperation(opParams) {
		var result = getResultObject();

		if (_self.timeline.getMediaTimeline(opParams.mediaObjectId)) {
			_self.timeline.removeMediaObject(opParams.mediaObjectId);
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyEffectCreateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			result = getResultObject();

		if (mediaTimeline) {
			mediaTimeline.addEffect(opParams.effect);
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyEffectUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			result = getResultObject();

		if (mediaTimeline) {
			var effect = mediaTimeline.getEffect(opParams.effectId);

			if (effect) {
				effect.setOptions(opParams.options);
				result.status = true;
				result.data = opParams;
			}
		}

		return result;
	}

	function applyEffectRemoveOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			result = getResultObject();

		if (mediaTimeline && mediaTimeline.getEffect(opParams.effectId)) {
			mediaTimeline.removeEffect(opParams.effectId);
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyMediaFrameUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			newProperty, updateResult, notUpdatedProperties,
			result = getResultObject();

		if (mediaTimeline) {
			updateResult = mediaTimeline.updateEffectsThatMatch(opParams.tick, opParams.updatedProperties);
			notUpdatedProperties = Common.filterObject(opParams.updatedProperties, updateResult.pendingProperties, true);

			if (updateResult.newProperties) {
				for(newProperty in updateResult.newProperties) {
					opParams.updatedProperties[newProperty] = updateResult.newProperties[newProperty];
				}
			}

			if (!Common.isEmpty(notUpdatedProperties)) {
				var mediaObject = mediaTimeline.getMediaObject();
				mediaObject.setProperties(notUpdatedProperties);
			}

			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyCanvasUpdateOperation(opParams) {
		var result = getResultObject();

		if (opParams.height) {
			_self.canvas.height = opParams.height;
		}

		if (opParams.width) {
			_self.canvas.width = opParams.width;
		}

		if (opParams.backgroundColor) {
			_self.canvas.backgroundColor = opParams.backgroundColor;
		}

		result.status = true;
		result.data = opParams;

		return result;
	}

	function applyShapeOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyShapeCreateOperation(opParams);
			case 'Remove':
				return applyShapeRemoveOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyMediaTimelineOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyMediaTimelineCreateOperation(opParams);
			case 'Remove':
				return applyMediaTimelineRemoveOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyEffectOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyEffectCreateOperation(opParams);
			case 'Update':
				return applyEffectUpdateOperation(opParams);
			case 'Remove':
				return applyEffectRemoveOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyMediaFrameOperation(operation, opParams) {
		switch (operation) {
			case 'Update':
				return applyMediaFrameUpdateOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyCanvasOperation(operation, opParams) {
		switch (operation) {
			case 'Update':
				return applyCanvasUpdateOperation(opParams);
			default:
				return getResultObject();
		}
	}

	this.applyOperation = function applyOperation(target, operation, opParams, context) {
		var result = getResultObject(),
			params;

		if (target && operation && opParams) {
			switch (target) {
				case 'Shape':
					result = applyShapeOperation(operation, opParams);
					break;
				case 'MediaTimeline':
					result = applyMediaTimelineOperation(operation, opParams);
					break;
				case 'Effect':
					result = applyEffectOperation(operation, opParams);
					break;
				case 'MediaFrame':
					result = applyMediaFrameOperation(operation, opParams);
					break;
				case 'Canvas':
					result = applyCanvasOperation(operation, opParams);
					break;
				default:
					return;
			}

			if (result.status) {
				target = result.target || target;
				operation = result.operation || operation;
				params = result.data || opParams;

				for (var observerId in updateObservers) {
					if (updateObservers.hasOwnProperty(observerId)) {
						if (!context || !context.sender || context.sender !== observerId) {
							updateObservers[observerId](target, operation, params, context);
						}
					}
				}
			}
		}
	};

	this.addUpdateObserver = function addUpdateObserver(observerId, observerFunction) {
		updateObservers[observerId] = observerFunction;
	};

	this.removeUpdateObserver = function removeUpdateObserver(observerId) {
		if (updateObservers.hasOwnProperty(observerId)) {
			delete updateObservers[observerId];
		}
	};

	this.addLoadCompleteObserver = function addLoadCompleteObserver(observerId, observerFunction) {
		loadCompleteObservers[observerId] = observerFunction;
	};

	this.removeLoadCompleteObserver = function removeLoadCompleteObserver(observerId) {
		if (loadCompleteObservers.hasOwnProperty(observerId)) {
			delete loadCompleteObservers[observerId];
		}
	};

	this.loadProject = function loadProject(json) {
		if (json && json.type && json.data) {
			var animationData = json.data;
			if (animationData.timeline.type && animationData.timeline.data) {
				_self.timeline.fromJSON(animationData.timeline.data);
			}

			if (animationData.canvas.type && animationData.canvas.data) {
				_self.canvas.fromJSON(animationData.canvas.data);
			}

			for(var observerId in loadCompleteObservers) {
				if (loadCompleteObservers.hasOwnProperty(observerId)) {
					loadCompleteObservers[observerId]();
				}
			}
		}
	};

	this.toJSON = function () {
		var ser =	{
						'canvas' : JsonSerializer.serializeObject(_self.canvas),
						'timeline' : JsonSerializer.serializeObject(_self.timeline)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		_self.timeline = JsonSerializer.deserializeObject(json.timeline);
		_self.canvas = JsonSerializer.deserializeObject(json.canvas);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

JsonSerializer.registerType(Animation);

module.exports = Animation;

},{"./canvas":3,"./mediaTimeline":18,"./serialization/jsonSerializer":30,"./timeline":37,"animates-common":1}],3:[function(_dereq_,module,exports){
'use strict';

var JsonSerializer = _dereq_('./serialization/jsonSerializer');

/**
 *  Creates a new Canvas.
 *  @class Represents a Canvas.
 */

function Canvas (options) {
	options = options || {};

	var _self = this; // Save the this reference for later use

	this.height = options.height || 400;
	this.width = options.width || 600;
	this.backgroundColor = options.backgroundColor || '#FFFFFF';
	this.backgroundImage = options.backgroundImage || '';

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.filterDrawables = function filterDrawables(mediaFrames) {
		return mediaFrames; //TODO filter media frames
	};

	this.toJSON = function () {
		var ser =	{
						'height' : _self.height,
						'width' : _self.width,
						'backgroundColor' : _self.backgroundColor,
						'backgroundImage' : _self.backgroundImage
					};

		return ser;
	};

	this.fromJSON = function (json) {
		_self.height = json.height;
		_self.width = json.width;
		_self.backgroundImage = json.backgroundImage;
		_self.backgroundColor = json.backgroundColor;
	};

	/**
	 *  Constructor
	 */
	(function postInit() {
	}());
}

JsonSerializer.registerType(Canvas);

module.exports = Canvas;

},{"./serialization/jsonSerializer":30}],4:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer');

/**
 *  Creates a new Effect.
 *  @class Represents an Effect .
 */
function Effect (options, builder) {

	options = options || {};

	var _self = this,
		guid = '',
		propBuilder,
		defaultOptions = {},
		currentOptions = {};

	/**
	 *  Constructor
	 */
	(function preInit() {
		currentOptions = Common.extend(options, defaultOptions);

		guid = currentOptions.guid || Common.createGuid();
		propBuilder = builder || new CompositePropertyBuilder();
		currentOptions = propBuilder.create();
	}());

	/**
	 * Calculates the new shape properties based on the original ones and the current tick.
	 * @param {integer} tick The current tick number.
	 * @param {object} originalProperties The original properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		return mediaFrameProperties;
	};

	/**
	 * Define whether an effect is infinte or has and start and end tick
	 * @return {string} the guid
	 */
	this.isInfinite = function () {
		return true;
	};

	/**
	 * Gets the guid of the effect
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getAffectedProperties = function () {
		return [];
	};

	/**
	* Updates the effect if it is required based on the updatedPropertiesDiff passed by parameter
	* @param {integer} tick the tick that is being updated
	* @param {Array} updatedPropertiesDiff the list of updated properties with the newValue as data for each property.
	* @return The array of properties names that the effect update
	*/
	this.updateProperties = function (tick, updatedPropertiesDiff) {
		return [];
	};

	/**
	* Gets the array of properties names that the effect modifies
	* @return The array of properties names
	*/
	this.getCommonAffectedPropertiesFromList = function (effectAffectedProperties) {
		var currentAffectedProperties = _self.getAffectedProperties();

		return currentAffectedProperties.filter(function(n) {
			return effectAffectedProperties.indexOf(n) != -1;
		});
	};

	/**
	 * Gets the array of properties names that the effect modifies
	 * @return The array of properties names
	 */
	this.getCommonAffectedProperties = function (effect) {
		return _self.getCommonAffectedPropertiesFromList(effect.getAffectedProperties());
	};

	/**
	* Detects if the current effect change some of the properties of the requested
	* effects also changes
	* If the strict parameter is passed as true then all the properties must match
	*
	* @param {Array} effectAffectedProperties The list of effect properties on which conflicts must be checked
	* @param {boolean} strict means that all properties must match to indicate a conflict
	* @return true if a match was found (according to the strict paramter)
	*/
	this.HasConflictWithListOfProperties = function (effectAffectedProperties, strict) {
		// Check for all properties to indicate a conflict
		var currentAffectedProperties = _self.getAffectedProperties();

		if (strict) {
			if (currentAffectedProperties.length == effectAffectedProperties.length) {
				for (var i = 0; i < currentAffectedProperties.length; i++) {
					if ((effectAffectedProperties.indexOf(currentAffectedProperties[i])) == -1)
					{
						return false;
					}
				}

				return true;
			} else {
				return false;
			}
		} else {
			return _self.getCommonAffectedPropertiesFromList(effectAffectedProperties).length > 0;
		}
	};

	/**
	 * Detects if the current effect change some of the properties of the requested
	 * effects also changes
	 * If the strict parameter is passed as true then all the properties must match
	 *
	 * @param {Effect} effect The effect on which conflicts must be checked
	 * @param {boolean} strict means that all properties must match to indicate a conflict
	 * @return true if a match was found (according to the strict paramter)
	 */
	this.HasConflictWithProperties = function (effect, strict) {
		return this.HasConflictWithListOfProperties(effect.getAffectedProperties(), strict);
	};

	this.getOption = function (name) {
		var prop = currentOptions.get(name);
		if (prop.value) {
			return prop.value();
		}

		return prop.valuesToJSON();
	};

	this.setOption = function (name, value) {
		currentOptions.setValue(name, value);
	};

	/**
	* Get the options values
	* @return {Object} The current properties
	*/
	this.getOptions = function getOptions() {
		return currentOptions.valuesToJSON();
		// TODO esto no va mas
	};

	/**
	* Get the properties schema with types and values
	* @return {Object} The current properties
	*/
	this.getPropertiesSchema = function getPropertiesSchema () {
		return currentOptions.clone();
	};

	this.setOptions = function (options) {
		for(var name in options) {
			_self.setOption(name, options[name]);
		}
	};

	this.toJSON = function () {
		var ser =	{
						'options' : currentOptions.valuesToJSON(),
						'guid' : _self.getGuid()
					};

		return ser;
	};

	this.fromJSON = function (json) {
		guid = json.guid;
		currentOptions.valuesFromJSON(json.options);
	};

	this.getType = function () {
		return Common.realTypeOf(this);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

JsonSerializer.registerType(Effect);

module.exports = Effect;

},{"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"./serialization/jsonSerializer":30,"animates-common":1}],5:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	straightPathStrategy = _dereq_('./pathStrategies/straightPathStrategy'),
	Effect = _dereq_('../finiteEffect.js');


/**
 *  Creates a new FadeEffect.
 *  @class Represents an FadeEffect .
 */
function FadeEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'startOpacity' : 0,
			'endOpacity' : 1
		};

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder
					.property('startOpacity', PropertyBuilder)
						.value(options.startOpacity)
						.type('float')
					.add()
					.property('endOpacity', PropertyBuilder)
						.value(options.endOpacity)
						.type('float')
					.add();

		_self.base(options, propBuilder);
	}());

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			startOpacity = _self.getOption('startOpacity'),
			endOpacity = _self.getOption('endOpacity'),
			currentOpacity;

		if (startTick > tick) {
			return mediaFrameProperties;
		}

		if (endTick <= tick) {
			currentOpacity = endOpacity;
		} else {
			var ticksAmount = endTick - startTick,
				currentPathPercentage = (tick - startTick) / ticksAmount,
				delta = (endOpacity - startOpacity) * currentPathPercentage;

			currentOpacity = startOpacity + delta;
		}

		mediaFrameProperties.opacity = currentOpacity;

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return ['opacity'];
	};

	this.updateProperties = function (tick, updatedProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			opacity = updatedProperties.opacity,
			changedProperties = [];

		if (opacity === undefined) {
			return { updatedProperties: changedProperties };
		}

		if (tick === startTick) {
			_self.setOption('startOpacity', opacity);
			changedProperties.push('opacity');
		}

		if (tick === endTick) {
			_self.setOption('endOpacity', opacity);
			changedProperties.push('opacity');
		}

		return { updatedProperties: changedProperties };
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(FadeEffect, Effect);

JsonSerializer.registerType(FadeEffect);

module.exports = FadeEffect;

},{"../finiteEffect.js":15,"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./pathStrategies/straightPathStrategy":13,"animates-common":1}],6:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	straightPathStrategy = _dereq_('./pathStrategies/straightPathStrategy'),
	FiniteEffect = _dereq_('../finiteEffect.js');


/**
 *  Creates a new MoveEffect.
 *  @class Represents an MoveEffect .
 */
function MoveEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'path' : 'Straight',
			'startPosition' : { 'x' : 0, 'y' : 0},
			'endPosition' : { 'x' : 0, 'y' : 0}
		};

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('path', PropertyBuilder)
						.value(options.path)
						.type('string')
						.strictValues(['Straight'])
					.add()
					.property('startPosition', CompositePropertyBuilder)
						.property('x', PropertyBuilder)
							.value(options.startPosition.x)
							.type('float')
						.add()
						.property('y', PropertyBuilder)
							.value(options.startPosition.y)
							.type('float')
						.add()
					.add()
					.property('endPosition', CompositePropertyBuilder)
						.property('x', PropertyBuilder)
							.value(options.endPosition.x)
							.type('float')
						.add()
						.property('y', PropertyBuilder)
							.value(options.endPosition.y)
							.type('float')
						.add()
					.add();

		_self.FiniteEffect(options, propBuilder);
	}());

	function getPointsArray() {
		return [
			{
				position : _self.getOption('startPosition'),
				tick : _self.getOption('startTick')
			},
			{
				position : _self.getOption('endPosition'),
				tick : _self.getOption('endTick')
			}
		];
	}

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var	path = _self.getOption('path');

		if (path == 'Straight') {
			var newPosition = (tick >= _self.getOption('startTick')) ? straightPathStrategy(tick, getPointsArray()) : {};

			for (var key in newPosition) {
				if (newPosition.hasOwnProperty(key)) {
					mediaFrameProperties.position[key] = newPosition[key];
				}
			}

			return mediaFrameProperties;
		}

		throw new Error('Invalid path property');
	};

	this.getAffectedProperties = function () {
		return ['position'];
	};

	this.updateProperties = function (tick, updatedProperties) {
		var startTick = _self.getOption('startTick'),
			endTick = _self.getOption('endTick'),
			positionX = updatedProperties['position.x'],
			positionY = updatedProperties['position.y'],
			changedProperties = [];

		if (positionX === undefined && positionY === undefined) {
			return { updatedProperties: changedProperties };
		}

		if (tick === startTick) {
			if (positionX !== undefined) {
				_self.setOption('startPosition.x', positionX);
				changedProperties.push('position.x');
			}

			if (positionY !== undefined) {
				_self.setOption('startPosition.y', positionY);
				changedProperties.push('position.y');
			}
		}

		if (tick === endTick) {
			if (positionX !== undefined) {
				_self.setOption('endPosition.x', positionX);
				changedProperties.push('position.x');
			}

			if (positionY !== undefined) {
				_self.setOption('endPosition.y', positionY);
				changedProperties.push('position.y');
			}
		}

		return { updatedProperties: changedProperties };
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MoveEffect, FiniteEffect, 'FiniteEffect');

JsonSerializer.registerType(MoveEffect);

module.exports = MoveEffect;

},{"../finiteEffect.js":15,"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./pathStrategies/straightPathStrategy":13,"animates-common":1}],7:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	MultiPointScaleEffect = _dereq_('./multiPointScaleEffect.js'),
	segmentHelper = _dereq_('./utils/segmentHelper');


/**
 *  Creates a new MultiPointFontSizeScaleEffect.
 *  @class Represents an MultiPointFontSizeScaleEffect .
 */
function MultiPointFontSizeScaleEffect(options, builder) {
	var _self = this,
		defaultOptions = {},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder,
			propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('fontSize', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add();

		_self.MultiPointScaleEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	this.getScalablePropertiesNames = function () {
		return ['fontSize'];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointFontSizeScaleEffect, MultiPointScaleEffect, 'MultiPointScaleEffect');

JsonSerializer.registerType(MultiPointFontSizeScaleEffect);

module.exports = MultiPointFontSizeScaleEffect;

},{"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./multiPointScaleEffect.js":11,"./utils/segmentHelper":14,"animates-common":1}],8:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	straightPathStrategy = _dereq_('./pathStrategies/straightPathStrategy'),
	MultiPointEffect = _dereq_('../multiPointEffect.js');


/**
 *  Creates a new MultiPointMoveEffect.
 *  @class Represents an MultiPointMoveEffect .
 */
function MultiPointMoveEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'path' : 'Straight',
			'points' : {}
		},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder;

		propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		propBuilder.property('path', PropertyBuilder)
						.value(currentOptions.path)
						.type('string')
						.strictValues(['Straight'])
					.add();

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('position', CompositePropertyBuilder)
				.property('x', PropertyBuilder)
					.type('float')
				.add()
				.property('y', PropertyBuilder)
					.type('float')
				.add()
			.add();

		_self.MultiPointEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var	path = _self.getOption('path');

		if (path == 'Straight') {
			var newPosition = straightPathStrategy(tick, _self.getPointsArray());

			if (newPosition && !mediaFrameProperties.hasOwnProperty('position')) {
				mediaFrameProperties.position = {};
			}

			for (var key in newPosition) {
				if (newPosition.hasOwnProperty(key)) {
					mediaFrameProperties.position[key] = newPosition[key];
				}
			}

			return mediaFrameProperties;
		}

		throw new Error('Invalid path property');
	};

	this.getAffectedProperties = function () {
		return ['position.x', 'position.y'];
	};

	function addPoint(guid, tick, x, y) {
		if (x === undefined || y === undefined) {
			var newPosition = straightPathStrategy(tick, _self.getPointsArray());

			if(x === undefined) {
				x = newPosition.x;
			}

			if(y === undefined) {
				y = newPosition.y;
			}
		}

		var data = {
						'position' : {
							'x' : x,
							'y' : y
						}
					};
		_self.addPoint(guid, tick, data);
	}

	this.updateProperties = function (tick, updatedProperties) {
		var positionX = updatedProperties['position.x'],
			positionY = updatedProperties['position.y'],
			changedProperties = [],
			points;

		if (positionX === undefined && positionY === undefined) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointMoveEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			addPoint(newPoint.guid, tick, positionX, positionY);
			return	{
						'updatedProperties' : ['position.y', 'position.x', 'MultiPointMoveEffect.newPoint']
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				if (positionX !== undefined) {
					_self.setOption('points.' + guid + '.position.x', positionX);
					changedProperties.push('position.x');
				}

				if (positionY !== undefined) {
					_self.setOption('points.' + guid + '.position.y', positionY);
					changedProperties.push('position.y');
				}
				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
		addPoint(newPointGuid, tick, positionX, positionY);
			return	{
						'updatedProperties' : ['position.y', 'position.x'],
						'newProperties' : {
							'MultiPointMoveEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid()}
						}
					};
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointMoveEffect, MultiPointEffect, 'MultiPointEffect');

JsonSerializer.registerType(MultiPointMoveEffect);

module.exports = MultiPointMoveEffect;

},{"../multiPointEffect.js":20,"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./pathStrategies/straightPathStrategy":13,"animates-common":1}],9:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	MultiPointScaleEffect = _dereq_('./multiPointScaleEffect.js'),
	segmentHelper = _dereq_('./utils/segmentHelper');


/**
 *  Creates a new MultiPointRadiusScaleEffect.
 *  @class Represents an MultiPointRadiusScaleEffect .
 */
function MultiPointRadiusScaleEffect(options, builder) {
	var _self = this,
		defaultOptions = {},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder,
			propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('radius', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add();

		_self.MultiPointScaleEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	this.getScalablePropertiesNames = function () {
		return ['radius'];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointRadiusScaleEffect, MultiPointScaleEffect, 'MultiPointScaleEffect');

JsonSerializer.registerType(MultiPointRadiusScaleEffect);

module.exports = MultiPointRadiusScaleEffect;

},{"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./multiPointScaleEffect.js":11,"./utils/segmentHelper":14,"animates-common":1}],10:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	straightPathStrategy = _dereq_('./pathStrategies/straightPathStrategy'),
	segmentHelper = _dereq_('./utils/segmentHelper'),
	MultiPointEffect = _dereq_('../multiPointEffect.js');


/**
 *  Creates a new MultiPointRotateEffect.
 *  @class Represents an MultiPointRotateEffect .
 */
function MultiPointRotateEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'points' : {}
		},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder;

		propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('angle', PropertyBuilder)
				.type('float')
			.add()
			.property('motion', PropertyBuilder)
				.type('string')
				.value('clockwise')
				.strictValues(['clockwise', 'counter-clockwise'])
			.add();

		_self.MultiPointEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	function getAngleFor(currentTick, startPoint, endPoint, clockwise) {
		var startTick = startPoint.tick,
			endTick = endPoint.tick,
			startAngle = startPoint.angle,
			endAngle = endPoint.angle,
			resultAngle,
			newLoopTick;

		function getLinearAngle (sAngle, eAngle, sTick, eTick, tick) {
			return sAngle + (((eAngle - sAngle) / (eTick - sTick)) * (tick - startTick));
		}

		if (clockwise && (startAngle > endAngle)) {
			// 359, 360, 1
			resultAngle = getLinearAngle(startAngle, endAngle + 360, startTick, endTick, currentTick);

			if (resultAngle > 360) {
				resultAngle -= 360;
			}
		} else if (!clockwise && (startAngle < endAngle)) {
			// 1, 0, 359
			resultAngle = getLinearAngle(startAngle + 360, endAngle, startTick, endTick, currentTick);

			if (resultAngle >= 360) {
				resultAngle -= 360;
			}
		} else {
			resultAngle = getLinearAngle(startAngle, endAngle, startTick, endTick, currentTick);
		}

		return resultAngle;
	}

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var points = _self.getPointsArray(),
			segment = segmentHelper.getSegment(tick, points);

		if (segment && segment.startPoint) {
			if (segment.endPoint) {
				mediaFrameProperties.angle = getAngleFor(tick, segment.startPoint, segment.endPoint, segment.endPoint.motion === 'clockwise');
			} else {
				mediaFrameProperties.angle = segment.startPoint.angle;
			}
		} else if (segment && segment.endPoint) {
			mediaFrameProperties.angle = segment.endPoint.angle;
		}

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return ['angle'];
	};

	function addPoint(guid, tick, angle, motion) {
		var data = { 'angle' : angle || 0, 'motion' : motion || 'clockwise'};
		_self.addPoint(guid, tick, data);
	}

	this.updateProperties = function (tick, updatedProperties) {
		var angle = updatedProperties.angle,
			motion = updatedProperties.motion,
			changedProperties = [],
			points;

		if (angle === undefined  && motion === undefined) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointRotateEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			addPoint(newPoint.guid, tick, angle, motion);
			return	{
						'updatedProperties' : ['angle', 'motion', 'MultiPointRotateEffect.newPoint']
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				if (angle) {
					_self.setOption('points.' + guid + '.angle', angle);
					changedProperties.push('angle');
				}

				if (motion) {
					_self.setOption('points.' + guid + '.motion', motion);
					changedProperties.push('motion');
				}

				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
		addPoint(newPointGuid, tick, angle, motion);
			return	{
						'updatedProperties' : ['angle', 'motion'],
						'newProperties' : {
							'MultiPointRotateEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid()}
						}
					};
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointRotateEffect, MultiPointEffect, 'MultiPointEffect');

JsonSerializer.registerType(MultiPointRotateEffect);

module.exports = MultiPointRotateEffect;

},{"../multiPointEffect.js":20,"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./pathStrategies/straightPathStrategy":13,"./utils/segmentHelper":14,"animates-common":1}],11:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	MultiPointEffect = _dereq_('../multiPointEffect.js'),
	segmentHelper = _dereq_('./utils/segmentHelper');


/**
 *  Creates a new MultiPointScaleEffect.
 *  @class Represents an MultiPointScaleEffect .
 */
function MultiPointScaleEffect(options, builder, pointsSchemaBuilder) {
	var _self = this,
		defaultOptions = {},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var propBuilder = builder || new CompositePropertyBuilder(),
			pointsBuilder = pointsSchemaBuilder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		_self.MultiPointEffect(options, propBuilder, pointsBuilder);
	}());

	function getScalablePropertiesIfExists(scalableProperties) {
		if (scalableProperties) {
			return scalableProperties;
		}

		return (_self.getScalablePropertiesNames) ? _self.getScalablePropertiesNames() : undefined;
	}

	function applyToScalableProperties(callback, scalableProperties) {
		var properties = getScalablePropertiesIfExists(scalableProperties);

		if (properties) {
			for (var i = 0; i < properties.length; i++) {
				callback(properties[i]);
			}
		}
	}

	function getScaleFor(currentTick, startPoint, endPoint, scaleType) {
		var startTick = startPoint.tick,
			endTick = endPoint.tick,
			startScale = startPoint[scaleType],
			endScale = endPoint[scaleType];

		if (startTick > currentTick) {
			return undefined; // The position can't be determined
		}

		if (endTick <= currentTick) {
			return endScale;
		}

		var ticksAmount = endTick - startTick,
			currentPathPercentage = (currentTick - startTick) / ticksAmount,
			delta = (endScale - startScale) * currentPathPercentage;

		return startScale + Math.round(delta);
	}

	function getScaleForSegment(tick, segment, scaleType) {
		if (segment && segment.startPoint) {
			if (segment.endPoint) {
				return getScaleFor(tick, segment.startPoint, segment.endPoint, scaleType);
			} else {
				return segment.startPoint[scaleType];
			}
		} else if (segment && segment.endPoint) {
			return segment.endPoint[scaleType];
		}
	}

	function updateMediaFrameProperties (tick, segment, scaleType, mediaFrameProperties) {
		if (mediaFrameProperties[scaleType]) {
			var scale = getScaleForSegment(tick, segment, scaleType);
			if (scale !== undefined) {
				mediaFrameProperties[scaleType] = scale;
			}
		}
	}

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var points = _self.getPointsArray(),
			segment = segmentHelper.getSegment(tick, points),
			scalableProperties = getScalablePropertiesIfExists();

		applyToScalableProperties(function(property) {
			updateMediaFrameProperties(tick, segment, property, mediaFrameProperties);
		}, scalableProperties);

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return getScalablePropertiesIfExists() || [];
	};

	function addScalePoint(guid, tick, inputData) {
		var points = _self.getPointsArray(),
			segment = segmentHelper.getSegment(tick, points),
			scalableProperties = getScalablePropertiesIfExists(),
			data = {};

		applyToScalableProperties(function(property) {
			data[property] = (inputData[property] === undefined) ? getScaleForSegment(tick, segment, property) : inputData[property];
		}, scalableProperties);

		_self.addPoint(guid, tick, data);
		return scalableProperties;
	}

	function updatePoint(scaleType, scaleValue, guid, changedProperties) {
		if (scaleValue !== undefined) {
			_self.setOption('points.' + guid + '.' + scaleType, scaleValue);
			changedProperties.push(scaleType);
		}
	}

	function updatePoints(data, guid, changedProperties, scalableProperties) {
		applyToScalableProperties(function(property) {
			updatePoint(property, data[property], guid, changedProperties);
		}, scalableProperties);
	}

	this.updateProperties = function (tick, updatedProperties) {
		var scalableProperties = getScalablePropertiesIfExists(),
			changedProperties = [],
			data = {},
			points,
			notFound = true;

		applyToScalableProperties(function(property) {
			if (updatedProperties[property] !== undefined) {
				notFound = false;
				data[property] = updatedProperties[property];
			}
		}, scalableProperties);

		if (notFound) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointScaleEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			changedProperties = addScalePoint(newPoint.guid, tick, data);
			changedProperties.push('MultiPointScaleEffect.newPoint');
			return	{
						'updatedProperties' : changedProperties
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				updatePoints(data, guid, changedProperties, scalableProperties);
				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
			return	{
						'updatedProperties' : addScalePoint(newPointGuid, tick, data),
						'newProperties' : {
							'MultiPointScaleEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid() }
						}
					};
	};

	this.getScalablePropertiesNames = function () {
		return [];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointScaleEffect, MultiPointEffect, 'MultiPointEffect');

JsonSerializer.registerType(MultiPointScaleEffect);

module.exports = MultiPointScaleEffect;

},{"../multiPointEffect.js":20,"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./utils/segmentHelper":14,"animates-common":1}],12:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	MultiPointScaleEffect = _dereq_('./multiPointScaleEffect.js'),
	segmentHelper = _dereq_('./utils/segmentHelper');


/**
 *  Creates a new MultiPointWidthAndHeightScaleEffect.
 *  @class Represents an MultiPointWidthAndHeightScaleEffect .
 */
function MultiPointWidthAndHeightScaleEffect(options, builder) {
	var _self = this,
		defaultOptions = {},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function preInit() {
		var pointsSchemaBuilder,
			propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('height', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add()
			.property('width', PropertyBuilder)
					.type('float')
					.constraint(function (val) { return val === undefined || (val >= 0); })
				.add();

		_self.MultiPointScaleEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	this.getScalablePropertiesNames = function () {
		return ['height', 'width'];
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(MultiPointWidthAndHeightScaleEffect, MultiPointScaleEffect, 'MultiPointScaleEffect');

JsonSerializer.registerType(MultiPointWidthAndHeightScaleEffect);

module.exports = MultiPointWidthAndHeightScaleEffect;

},{"../properties/compositePropertyBuilder":23,"../properties/dictionaryPropertyBuilder":25,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"./multiPointScaleEffect.js":11,"./utils/segmentHelper":14,"animates-common":1}],13:[function(_dereq_,module,exports){
'use strict';

var segmentHelper = _dereq_('../utils/segmentHelper');

/**
 *  Straigth path strategy
 */
function straightPathStrategy (currentTick, points) {

	/**
	 * Calculates the new position based on the the currentTick, the start and end ticks and the start and end position.
	 * @param {integer} startTick The start tick number.
	 * @param {integer} endTick The end tick number.
	 * @param {integer} currentTick The current tick number.
	 * @returns {object} The postion {x, y} for the current tick
	 */
	function getPositionFor(currentTick, startPoint, endPoint) {
		var startX = startPoint.position.x,
			startY = startPoint.position.y,
			startTick = startPoint.tick,
			endX = endPoint.position.x,
			endY = endPoint.position.y,
			endTick = endPoint.tick;

		if (startTick > currentTick) {
			return {}; // The position can't be determined
		}

		if (endTick <= currentTick) {
			return { 'x' : endX, 'y' : endY };
		}

		var ticksAmount = endTick - startTick,
			currentPathPercentage = (currentTick - startTick) / ticksAmount,
			xDelta = (endX - startX) * currentPathPercentage,
			yDelta = (endY - startY) * currentPathPercentage;

		return { 'x' : startX + Math.round(xDelta), 'y' : startY + Math.round(yDelta) };
	}

	var segment = segmentHelper.getSegment(currentTick, points);

	if (segment && segment.startPoint) {
		if (!segment.endPoint) {
			return {
				'x' : segment.startPoint.position.x,
				'y' : segment.startPoint.position.y
			};
		}

		return getPositionFor(currentTick, segment.startPoint, segment.endPoint);
	} else if (segment && segment.endPoint) {
		return {
			'x' : segment.endPoint.position.x,
			'y' : segment.endPoint.position.y
		};
	}

	return {};
}

module.exports = straightPathStrategy;

},{"../utils/segmentHelper":14}],14:[function(_dereq_,module,exports){
'use strict';

/**
 * Retrieves the startPoint and the endPoint given a tick and the list of points.
 * @param {integer} currentTick The current tick number.
 * @param {Array} points The array of points
 * @returns {object} The segment's start and end points {startPoint, endPoint} for the current tick
 */
function getSegment(currentTick, points) {
  var sortedPoints = points.sort(function comparePoints(pointA, pointB) {
    return pointA.tick - pointB.tick;
  });

  if (points.length === 0){
      return {};
  }

  if (points[0].tick > currentTick) {
    return {
      endPoint : points[0]
    };
  }

  if (points[points.length - 1].tick <= currentTick) {
    return {
      startPoint : points[points.length - 1]
    };
  }

  for (var i = 1; i < points.length; i++) {
    if (points[i].tick >= currentTick) {
      return {
        startPoint : points[i - 1],
        endPoint : points[i]
      };
    }
  }
}

module.exports = {
  'getSegment' : getSegment
};

},{}],15:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	Effect = _dereq_('./effect');

/**
 *  Creates a new FiniteEffect.
 *  @class Represents an FiniteEffect .
 */
function FiniteEffect (options, builder) {

	options = options || {};

	var _self = this,
		propBuilder,
		defaultOptions = {
			startTick : 0,
			endTick : 100
		},
		currentOptions = {};

	/**
	 *  Constructor
	 */
	(function preInit() {
		currentOptions = Common.extend(options, defaultOptions);
		if (currentOptions.endTick !== -1 && currentOptions.endTick <= currentOptions.startTick) {
			currentOptions.endTick = currentOptions.startTick + defaultOptions.endTick;
		}

		propBuilder = builder || new CompositePropertyBuilder();
		propBuilder.property('endTick', PropertyBuilder)
						.value(currentOptions.endTick)
						.type('float')
						.constraint(function (val) { return (val >= 0) && (!_self.getOption || (val > _self.getOption('startTick'))); })
					.add()
					.property('startTick', PropertyBuilder)
						.value(currentOptions.startTick)
						.type('float')
						.constraint(function (val) { return (val >= 0) && (!_self.getOption || (val < _self.getOption('endTick'))); })
					.add();

		_self.Effect(currentOptions, propBuilder);
	}());

	this.isInfinite = function() {
		return false;
	};

	var baseSetOptions = this.setOptions;
	this.setOptions = function (options) {
		var newOptions = {};

		if (options.startTick !== undefined && options.endTick !== undefined) {
			for(var name in options) {
				if (name !== 'startTick' && name !== 'endTick') {
					_self.setOption(name, options[name]);
				} else {
					newOptions[name] = options[name];
				}
			}

			if (newOptions.startTick > _self.getOption('endTick')) {
				_self.setOption('endTick', newOptions.endTick);
				_self.setOption('startTick', newOptions.startTick);
			} else {
				_self.setOption('startTick', newOptions.startTick);
				_self.setOption('endTick', newOptions.endTick);
			}
		} else {
			baseSetOptions(options);
		}
	};

	var baseFromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.setOption('endTick', Number.MAX_VALUE);
		baseFromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(FiniteEffect, Effect, 'Effect');

JsonSerializer.registerType(FiniteEffect);

module.exports = FiniteEffect;

},{"./effect":4,"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"./serialization/jsonSerializer":30,"animates-common":1}],16:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	MediaObject = _dereq_('./mediaObject');

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
	*  Constructor
	*/
	(function preInit() {
		currentOptions = Common.extend(options || {}, defaultOptions),
		currentProperties = currentOptions.mediaObject.getProperties();
	}());

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
	 * Get the property named after the first parameter value
	 * @return {Object} The property value
	 */
	this.getProperty = function getProperty(name)
	{
		if (name) {
			var parts = name.split('.'),
			parent = currentProperties,
			currentPart = '',
			length = parts.length;

			for(var i = 0; i < length && parent; i++) {
				currentPart = parts[i];
				parent = parent[currentPart];
			}

			return parent;
		}

		return undefined;
	};

	this.getPropertiesSchema = function getPropertiesSchema () {
		var schema = currentOptions.mediaObject.getPropertiesSchema();
		schema.valuesFromJSON(currentProperties);
		return schema;
	};

	/**
	 * Gets the guid of the original MediaObject
	 * @return {string} the guid
	 */
	this.getMediaObjectGuid = function getMediaObjectGuid (values) {
		return currentOptions.mediaObject.getGuid();
	};

	/**
	 * Gets the type of the original MediaObject
	 * @return {string} the type
	 */
	this.getMediaObjectType = function getMediaObjectType (values) {
		return currentOptions.mediaObject.getType();
	};


	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = MediaFrame;

},{"./mediaObject":17,"animates-common":1}],17:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer');


/**
 *  Creates a new MediaObject
 *  @class Represents a MediaObject.
 */
function MediaObject (options, builder) {
	var _self = this,
		guid = '',
		propBuilder,
		properties,
		defaultOptions = {
			name : 'Object'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);
		guid = options.guid || Common.createGuid();

		propBuilder.property('name', PropertyBuilder)
						.type('string')
						.value(options.name)
					.add();

		properties = propBuilder.create();
	}());

	/**
	 * Get the properties schema with types and values
	 * @return {Object} The current properties
	 */
	this.getPropertiesSchema = function getPropertiesSchema () {
		return properties.clone();
	};

	/**
	 * Get the properties values
	 * @return {Object} The current properties
	 */
	this.getProperties = function getProperties() {
		return properties.valuesToJSON();
		// TODO esto no va mas
	};

	/**
	 * Set the properties values
	 * @params {array} properties An array with properties: values pairs to be updated
	 */
	this.setProperties = function setProperties(prop) {
		for (var propertyName in prop) {
			properties.setValue(propertyName, prop[propertyName]);
		}
	};

	/**
	 * Get the property named after the first parameter value
	 * @return {Object} The property value
	 */
	this.getProperty = function getProperty(name) {
		return properties.getValue(name);
	};

	/**
	 * Set the property named after the first parameter value
	 * @params {string} name The property name
	 * @params {Object} value The property value
	 */
	this.setProperty = function setProperty(name, value) {
		properties.setValue(name, value);
	};

	/**
	 * Gets the guid of the MediaObject
	 * @return {string} the guid
	 */
	this.getGuid = function getGuid() {
		return guid;
	};

	this.getType = function getType() {
		return Common.realTypeOf(this);
	};

	this.getScalableProperties = function getScalableProperties() {
		return [];
	};

	this.toJSON = function () {
		var ser =	{
						'properties' : properties.valuesToJSON(),
						'guid' : _self.getGuid()
					};

		return ser;
	};

	this.fromJSON = function (json) {
		properties.valuesFromJSON(json.properties);
		guid = json.guid;
	};


	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

JsonSerializer.registerType(MediaObject);

module.exports = MediaObject;

},{"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"./serialization/jsonSerializer":30,"animates-common":1}],18:[function(_dereq_,module,exports){
'use strict';

var MediaFrame = _dereq_('./mediaFrame'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new media timeline.
 *  @class Represents a timeline for a media object.
 */
function MediaTimeline (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		mediaObject = options.mediaObject,
		effects = {};

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	/**
	 * Calculates the media object based on the original properties and the current tick.
	 * @param {integer} currentTick The current tick.
	 */
	this.getMediaFrameFor = function getMediaFrameFor(currentTick) {
		var mediaObjectFrame = new MediaFrame({ 'mediaObject' : mediaObject, 'currentTick' : currentTick }),
			effectsArray = [],
			currentEffect;

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				effectsArray.push(effects[id]);
			}
		}

		effectsArray.sort(function(a,b) {
			if (a.isInfinite() && b.isInfinite()) {
				return 0;
			} else if (a.isInfinite()) {
				return 1;
			} else if (b.isInfinite()) {
				return -1;
			} else {
				return b.getOption('endTick') - a.getOption('endTick');
			}
		});

		for (var i = effectsArray.length - 1; i >= 0; i--) {
			currentEffect = effectsArray[i];
			if (currentEffect.isInfinite()) {
					mediaObjectFrame.properties(currentEffect.getProperties(currentTick, mediaObjectFrame.properties()));
			} else {
				if (currentTick >= currentEffect.getOption('startTick')) {
					var effectEndTick = currentEffect.getOption('endTick'),
						endTick = (currentTick < effectEndTick) ? currentTick : effectEndTick;

					mediaObjectFrame.properties(
						currentEffect.getProperties(endTick,
								mediaObjectFrame.properties()));
				}
			}
		}

		return mediaObjectFrame;
	};

	/**
	 * Get the media object id
	 * @return {string} The media object id.
	 */
	this.getMediaObjectId = function getMediaObjectId() {
		return mediaObject.getGuid();
	};

	/**
	* Get the media object name
	* @return {string} The media object name.
	*/
	this.getMediaObjectName = function getMediaObjectName() {
		return mediaObject.getProperty('name');
	};

	/**
	 * Get the media object
	 * @return {string} The media object.
	 */
	this.getMediaObject = function getMediaObject() {
		return mediaObject;
	};

	/**
	 * Finds the most suitable start tick for the requested effect considering all
	 * effects thay may change the same requested properties before it.
	 * @param {Array} affectedProperties The properties to be considered during the search of effects
	 * @param {integer} upperTickLimit Upper limit tick to look for effects. Effects that starts
	 * after this tick may not be considered
	 * @return {integer} the start tick
	 */
	this.getStartTickFor = function getStartTickFor (effect, upperTickLimit) {
		var endTick = 0;

		// up to now for us there is no effect that conflicts with the requested properties

		// Look for effects in the media timeline
		var effects = this.getEffects();
		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				var currentEffect = effects[id];

				// Only consider effects that start before the upperLimitTick
				if (!currentEffect.isInfinite() && currentEffect.getOption('startTick') < upperTickLimit) {
					if (currentEffect.HasConflictWithProperties(effect)) {
						if (endTick < currentEffect.getOption('endTick')) {
							endTick = currentEffect.getOption('endTick');
						}
					}
				}
			}
		}

		return endTick;
	};

	/**
	 * Gets the effects that contains the requested tick
	 * @param {integer} tick The tick that must be contained by the effects
	 * @return {Array} The array of effects that contains the tick
	 */
	this.getEffectsForTick = function (tick) {
		var effects = this.getEffects(),
			resultEffects = [];

		for (var id in effects) {
			if (effects.hasOwnProperty(id)) {
				var currentEffect = effects[id];

				// If the effect contains the tick
				if (currentEffect.isInfinite() || (currentEffect.getOption('startTick') <= tick) && (currentEffect.getOption('endTick') >= tick)) {
					resultEffects.push(currentEffect);
				}
			}
		}

		return resultEffects;
	};

	/**
	* Gets the effects that contains the requested tick filtered by the ones that match any of the propertiesList
	* @param {integer} tick The tick that must be contained by the effects
	* @param {Array} tick propertiesList Array of effects that use to filter effects in current tick
	* @return {Array} The array of effects that contains the tick
	*/
	this.getEffectsForTickThatMatch = function (tick, propertiesList) {
		var effects = this.getEffectsForTick(tick),
			resultEffects = [];

		for (var i = 0; i < effects.length; i++) {
			if (effects[i].HasConflictWithListOfProperties(propertiesList)) {
				resultEffects.push(effects[i]);
			}
		}

		return resultEffects;
	};

	/**
	* Updates all effects that match the updated properties in the tick passed by parameter.
	* @param {integer} tick The tick that must be contained by the effects
	* @param {Map} updatedProperties Map of new properties updates that will be used to update all the effects
	* @return {Array} The not updated properties
	*/
	this.updateEffectsThatMatch = function (tick, updatedProperties) {
		var propertiesList = Common.getKeysFromObject(updatedProperties),
			effects = this.getEffectsForTickThatMatch(tick, propertiesList),
			updateResult,
			newProperty,
			newProperties = {};

		for (var i = 0; i < effects.length; i++) {
			updateResult = effects[i].updateProperties(tick, updatedProperties);

			propertiesList = Common.filterArray(propertiesList, updateResult.updatedProperties);

			if (updateResult.newProperties) {
				for(newProperty in updateResult.newProperties) {
					newProperties[newProperty] = updateResult.newProperties[newProperty];
				}
			}
		}

		return {
			pendingProperties: propertiesList,
			newProperties : newProperties
		};
	};

	/**
	 * Add a new effect to the media object timeline.
	 * @param {Effect} effect the effect that will be added.
	 */
	this.addEffect = function addEffect(effect) {
		if (effect) {
			effects[effect.getGuid()] = effect;
		}
	};

	/**
	 * Remove the effect from the media object timeline that correspond to the effectId
	 * @param  {string} effectId The id that was used when the effect was added.
	 */
	this.removeEffect = function removeEffect(effectId) {
		if (effectId) {
			delete effects[effectId];
		}
	};

	/**
	 * Return the effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffect = function getEffect(effectId) {
		return effects[effectId];
	};

	/**
	 * Return the collection of effect.
	 * @return {Object} A dictionary with all the effects.
	 */
	this.getEffects = function getEffects() {
		return effects;
	};

	this.toJSON = function () {
		var ser =	{
						'mediaObject' : JsonSerializer.serializeObject(mediaObject),
						'effects' : JsonSerializer.serializeDictionary(effects)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		mediaObject = JsonSerializer.deserializeObject(json.mediaObject);
		effects = JsonSerializer.deserializeDictionary(json.effects);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

JsonSerializer.registerType(MediaTimeline);

module.exports = MediaTimeline;

},{"./mediaFrame":16,"./serialization/jsonSerializer":30,"animates-common":1}],19:[function(_dereq_,module,exports){
'use strict';

var model = {
	// Core
	MediaObject : _dereq_('./mediaObject'),
	VisualMediaObject : _dereq_('./visualMediaObject'),
	Effect : _dereq_('./effect'),
	Timeline : _dereq_('./timeline'),
	MediaTimeline : _dereq_('./mediaTimeline'),
	MediaFrame : _dereq_('./mediaFrame'),
	Canvas : _dereq_('./canvas'),
	Animation : _dereq_('./animation'),

	// media objects
	Shape : _dereq_('./shape'),
	Rectangle : _dereq_('./shapes/rectangle'),
	Triangle : _dereq_('./shapes/triangle'),
	Circle : _dereq_('./shapes/circle'),
	Text : _dereq_('./text'),
	Photo : _dereq_('./photo'),
	Sound : _dereq_('./sound'),

	// effects
	MoveEffect : _dereq_('./effects/moveEffect'),
	FadeEffect: _dereq_('./effects/fadeEffect'),

	JsonSerializer: _dereq_('./serialization/jsonSerializer'),
};

 module.exports = model;

},{"./animation":2,"./canvas":3,"./effect":4,"./effects/fadeEffect":5,"./effects/moveEffect":6,"./mediaFrame":16,"./mediaObject":17,"./mediaTimeline":18,"./photo":21,"./serialization/jsonSerializer":30,"./shape":31,"./shapes/circle":32,"./shapes/rectangle":33,"./shapes/triangle":34,"./sound":35,"./text":36,"./timeline":37,"./visualMediaObject":38}],20:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('./properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	straightPathStrategy = _dereq_('./effects/pathStrategies/straightPathStrategy'),
	Effect = _dereq_('./effect.js');


/**
 *  Creates a new MultiPointEffect.
 *  @class Represents an MultiPointEffect .
 */
function MultiPointEffect(options, builder, pointsSchemaBuilder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'points' : {}
		},
		currentOptions,
		cachedPointsArray;

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		pointsSchemaBuilder = pointsSchemaBuilder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		propBuilder.property('points', DictionaryPropertyBuilder)
						.instancedSchema(pointsSchemaBuilder)
							.property('tick', PropertyBuilder)
								.type('float')
							.add()
						.add()
						.values(currentOptions.points)
					.add();

		_self.Effect(currentOptions, propBuilder);
	}());

	this.refreshPointsArray = function refreshPointsArray () {
		var pointsArray = [],
			points = _self.getOption('points');

		for (var key in points) {
			pointsArray.push(points[key]);
		}

		cachedPointsArray = pointsArray;
	};

	this.getPointsArray = function getPointsArray() {
		return cachedPointsArray;
	};

	this.addPoint = function addPoint(guid, tick, data) {
		var newPointData = { 'tick' : tick };

		for (var prop in data) {
			newPointData[prop] = data[prop];
		}

		_self.setOption('points.' + guid, newPointData);
		this.refreshPointsArray();
	};

	this.base_setOption = this.setOption;
	this.setOption = function (name, value) {
		if (name.slice(0,6) === 'points' && name.slice(-4) === 'tick') {
			// Check if a point exists in the same tick and then remove the old point.
			var points = _self.getOption('points'),
				pointId = name.slice(7).slice(0,-5);

			for (var key in points) {
				if (points[key].tick === value && key !== pointId) {
					// A point already exist in the same tick, remove it
					this.base_setOption('points.' + key , undefined);
				}
			}
		}

		this.base_setOption(name, value);
		_self.refreshPointsArray();
	};

	var baseFromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		baseFromJSON(json);
		_self.refreshPointsArray();
	};

	/**
	*  Constructor
	*/
	
	(function postInit() {
		_self.refreshPointsArray();
	}());
}

Common.inherits(MultiPointEffect, Effect, 'Effect');

JsonSerializer.registerType(MultiPointEffect);

module.exports = MultiPointEffect;

},{"./effect.js":4,"./effects/pathStrategies/straightPathStrategy":13,"./properties/compositePropertyBuilder":23,"./properties/dictionaryPropertyBuilder":25,"./properties/propertyBuilder":27,"./serialization/jsonSerializer":30,"animates-common":1}],21:[function(_dereq_,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = _dereq_('./visualMediaObject'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Photo
 *  @class Represents a Photo.
 */
function Photo (options, builder) {
	var _self = this,propBuilder,
		properties,
		defaultOptions = {
			height : 100,
			width : 100,
			source : '',
			name: 'Photo'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);


		propBuilder.property('height', PropertyBuilder)
						.value(options.height)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('width', PropertyBuilder)
						.value(options.width)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('source', PropertyBuilder)
						.value(options.source)
						.type('imageFile')
					.add();

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['height', 'width'];
	};

	this.base_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.base_toJSON();
	};

	this.base_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.base_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Photo, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Photo);

module.exports = Photo;

},{"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"./serialization/jsonSerializer":30,"./visualMediaObject":38,"animates-common":1}],22:[function(_dereq_,module,exports){
'use strict';


function CompositeProperty () {
	var properties = {},
		_self = this;

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.add = function (name, property) {
		properties[name] = property;
	};

	this.remove = function (name) {
		delete properties[name];
	};

	this.length = function () {
		return Object.keys(properties).length;
	};

	this.get = function (name) {
		var parts = name.split('.'),
			currentPart = '',
			length = parts.length,
			property;

		property = properties[parts[0]];
		if (property) {
			for(var i = 1; i < length && property; i++) {
				if (property.get) {
					property = property.get(parts[i]);
				} else {
					throw new Error("Property '" + parts[i] + "' could not be found.");
				}
			}
			return property;
		} else {
			throw new Error("Property '" + parts[0] + "' could not be found.");
		}
	};

	this.getValue = function (name) {
		var property = _self.get(name);
		if (property.value) {
			return property.value();
		} else if (property.valuesToJSON) {
			return property.valuesToJSON();
		} else {
			throw new Error("Property '" + name + "' could not be found.");
		}

	};

	this.setValue = function (name, value) {
		var parts = name.split('.'),
			currentPart = '',
			length = parts.length,
			property;

		property = properties[parts[0]];
		if (property) {
			if (property.value) { // its a leaf
				if (length > 1) {
					throw new Error("Property '" + parts[1] + "' does not exists.");
				} else {
					property.value(value);
				}
			} else { // its a composite
				var newName = name.replace(parts[0] + '.','');
				property.setValue(newName, value);
			}
		} else {
			throw new Error("Property '" + parts[0] + "' could not be found.");
		}
	};

	this.names = function (root) {
		var namesArray = [];

		if (root) {
			for (var rootPropName in properties) {
				namesArray.push(rootPropName);
			}
		} else {
			for (var propName in properties) {
				var prop = properties[propName];
				if (prop.value) {
					namesArray.push(propName);
				} else {
					var aux = prop.names();
					for(var i = 0; i < aux.length; i++) {
						aux[i] = propName + '.' + aux[i];
					}
					namesArray = namesArray.concat(aux);
				}
			}
		}
		return namesArray;
	};

	this.valuesToJSON = function () {
		var json = {};
		for (var prop in properties) {
			var property = properties[prop];
			if (property.value) {
				json[prop] = property.value();
			} else {
				json[prop] = property.valuesToJSON();
			}
		}

		return json;
	};

	this.valuesFromJSON = function (json) {
		for (var prop in json) {
			var property = properties[prop];
			if (property.value) {
				property.value(json[prop]);
			} else {
				property.valuesFromJSON(json[prop]);
			}
		}

		return json;
	};

	this.clone = function clone() {
		var newProp = new CompositeProperty();

		for (var prop in properties) {
			newProp.add(prop, properties[prop].clone());
		}

		return newProp;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = CompositeProperty;

},{}],23:[function(_dereq_,module,exports){
'use strict';

var PropertyBuilder = _dereq_('./propertyBuilder'),
	DictionaryPropertyBuilder = _dereq_('./dictionaryPropertyBuilder'),
	PropertyBuilder = _dereq_('./propertyBuilder'),
	CompositeProperty = _dereq_('./compositeProperty');

/**
 *  Builds custom properties with specified types and constraints
 *  @class Represents an CompositePropertyBuilder.
 */
function CompositePropertyBuilder () {
	var _self = this,
		name = '',
		properties = new CompositeProperty();

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.name = function (arrayName) {
		name = arrayName;
	};

	this.property = function (name, BuilderClass) {
		var builder = new BuilderClass();
		builder.name(name);
		builder.add = function () {
			properties.add(name, builder.create());
			return _self;
		};
		return builder;
	};

	this.create = function () {
		return properties;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = CompositePropertyBuilder;

},{"./compositeProperty":22,"./dictionaryPropertyBuilder":25,"./propertyBuilder":27}],24:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	CompositeProperty = _dereq_('./compositeProperty');


function DictionaryProperty () {
	var _self = this,
		schema,
		base_add;

	/**
	 *  Constructor
	 */
	(function preInit() {
		_self.base();
		base_add = _self.add;
	}());

	this.add = function() {
		throw new Error('Method add cannot be called from outside a builder');
	}; // hide add method

	this.values = function () {
		var values = {},
			names = _self.names(true);

		for (var i = 0; i < names.length; i++) {
			values[names[i]] = _self.get(names[i]);
		}

		return values;
	};

	this.schema = function (newSchema) {
		schema = newSchema;
	};

	this.setValue = function (name, value) {
		var property;

		if (schema) {
			try {
				if (value === undefined && name.indexOf('.') === -1) {
					_self.remove(name);
				} else {
					property = _self.get(name);
					property.value(value);
				}
			} catch (err) {
				// Just try to add it when its property name (not a path)
				if (name.indexOf('.') === -1) {
					var newProp = schema.create().clone();
					newProp.valuesFromJSON(value);
					base_add(name, newProp);
				} else {
					throw err;
				}
			}
		} else {
			throw new Error("Set an schema before trying to set a value for the property '" + name + "'");
		}
	};

	this.valuesFromJSON = function (json) {
		var newProp;
		for (var name in json) {
			newProp = schema.create().clone();
			newProp.valuesFromJSON(json[name]);
			base_add(name, newProp);
		}

		return json;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(DictionaryProperty, CompositeProperty);

module.exports = DictionaryProperty;

},{"./compositeProperty":22,"animates-common":1}],25:[function(_dereq_,module,exports){
'use strict';

var PropertyBuilder = _dereq_('./propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./compositePropertyBuilder'),
	CompositeProperty = _dereq_('./compositeProperty'),
	DictionaryProperty = _dereq_('./dictionaryProperty');

/**
 *  Builds a dictionary of custom properties
 *  @class Represents an DictionaryPropertyBuilder.
 */
function DictionaryPropertyBuilder () {
	var _self = this,
		name = '',
		currentValues = [],
		schemaBuilder;

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.name = function (value) {
		name = value;
		return _self;
	};

	this.schema = function (BuilderClass) {
		schemaBuilder = new BuilderClass(_self);
		return _self.instancedSchema(schemaBuilder);
	};

	this.instancedSchema = function (builder) {
		schemaBuilder = builder;
		schemaBuilder.name('schema');
		schemaBuilder.add = function () {
			return _self;
		};
		return schemaBuilder;
	};

	this.values = function (values) {
		currentValues = values;
		return _self;
	};

	this.create = function () {
		var properties = new DictionaryProperty();
		properties.schema(schemaBuilder);

		for(var key in currentValues) {
			properties.setValue(key, currentValues[key]);
		}

		return properties;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = DictionaryPropertyBuilder;

},{"./compositeProperty":22,"./compositePropertyBuilder":23,"./dictionaryProperty":24,"./propertyBuilder":27}],26:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer');

/**
 *  Holds values and constraints and types.
 *  @class Represents a Property.
 */
function Property (options) {
	var _self = this,
		defaultOptions = {
			name : '',
			value : '',
			type : null,
			constraints : [],
			strictValues : []
		},
		currentOptions;

	/**
	*  Constructor
	*/
	(function preInit() {
		currentOptions = Common.extend(options || {}, defaultOptions);
	}());

	this.value = function (val, avoidValidation) {
		if (arguments.length > 0) {
			if (avoidValidation) {
				currentOptions.value = val;
			} else {
				if (_self.isValid(val)) {
					currentOptions.value = val;
				} else {
					throw new Error('The value "' + val + '" is not valid for the property "' + _self.name() + '"');
				}
			}
		} else {
			return currentOptions.value;
		}
	};

	/**
	 * Indicates wheter the current property has a set of values that can take.
	 */
	this.isStrict = function isStrict() {
		return currentOptions.strictValues.length > 0;
	};

	this.strictValues = function strictValues () {
		return Common.clone(currentOptions.strictValues);
	};

	/**
	 * Indicates wheter the current property or the value param is valid.
	 * @param {object} [value=undefined] - The value to validate.
	 */
	this.isValid = function isValid(value) {
		var valid = true,
			valueToValidate = arguments.length > 0 ? value : currentOptions.value;

		if (!currentOptions.type.isValid(valueToValidate)) {
			return false;
		}

		for (var i=0; i < currentOptions.constraints.length; i++) {
			if (!currentOptions.constraints[i](valueToValidate)) {
				return false;
			}
		}

		return valid;
	};

	this.parse = function parse (value) {
		currentOptions.value = currentOptions.type.parse(value);
	};

	this.name = function () {
		return currentOptions.name;
	};

	this.type = function type () {
		return currentOptions.type;
	};

	this.clone = function clone() {
		var newPropOp = Common.clone(currentOptions),
			newProp = new Property(newPropOp);

		return newProp;
	};
	
	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

JsonSerializer.registerType(Property);

module.exports = Property;

},{"../serialization/jsonSerializer":30,"animates-common":1}],27:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common'),
	Property = _dereq_('./property'),
	TypesManager = _dereq_('./typesManager');

/**
 *  Builds properties with constraints and values.
 *  @class Represents an PropertyBuilder.
 */
function PropertyBuilder() {
	var options = {
			'constraints' : [],
			'value' : '',
			'type' : null,
			'name' : null,
			'strictValues' : []
		},
		_self = this,
		types = {};

	/**
	*  Constructor
	*/
	(function preInit() {
	}());


	this.name = function name(propName) {
		options.name = propName;
		return _self;
	};

	this.value = function value(propVal) {
		options.value = propVal;
		return _self;
	};

	this.type = function type (propType) {
		var currentType = TypesManager.getType(propType);
		if (currentType) {
			options.type = currentType;
		} else {
			throw new Error("The type '" + propType + "' is not registered");
		}
		return _self;
	};

	this.strictValues = function (values) {
		options.strictValues = values;
		return _self;
	};

	this.constraint = function constraint(propConstraint) {
		options.constraints.push(propConstraint);
		return _self;
	};

	this.create = function create () {
		var property;

		if (options.name === null) {
			throw new Error('The property could not be built because it does not have a name.');
		}

		if (options.type === null) {
			throw new Error("The property '" + options.name + "' could not be built because the type was not defined.");
		}

		// Add the constraint for the strictValues
		if (options.strictValues.length > 0) {
			options.constraints.push( function (val) {
				return (options.strictValues.indexOf(val) >= 0);
			});
		}

		property = new Property(options);

		if (property.isValid()) {
			return property;
		} else {
			throw new Error("The property '" + options.name + "' could not be built due to invalid value.");
		}
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = PropertyBuilder;

},{"./property":26,"./typesManager":29,"animates-common":1}],28:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common');

/**
 *  Types have it own constraints and are usefull to validate properties values
 *  @class Represents a property types.
 */
function Type (options) {
	var defaultOptions = {
		'name' : '',
		'constraints' : [],
		'parentType' : null,
		'parse': function (value) { return value; }
	},
	currentOptions;

	/**
	*  Constructor
	*/
	(function preInit() {
		currentOptions = Common.extend(options || {}, defaultOptions);
	}());

	this.name = function name () {
		return currentOptions.name;
	};

	this.isValid = function isValid(value) {
		var valid = true;

		if (currentOptions.parentType) {
			if (!currentOptions.parentType.isValid(value)) {
				return false;
			}
		}

		for (var i=0; i < currentOptions.constraints.length; i++) {
			if (!currentOptions.constraints[i](value)) {
				return false;
			}
		}

		return valid;
	};

	this.parse = function parse (value) {
		return currentOptions.parse(value);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = Type;

},{"animates-common":1}],29:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('./type'),
	manager;



/**
 *  Indicates vistualization options for MediaObjects properties.
 *  @class Represents an TypesManager.
 */

function TypesManager (options) {
	var _self = this,
		types = {};

	this.registerType = function registerType (name, constraints, parse, parent) {
		var options,
			type;

		options = {
			'name' : name,
			'constraints' : constraints,
			'parse': parse
		};

		if (parent && types[parent]) {
			options.parentType = types[parent];
		}

		types[name] = new Type(options);
	};

	this.getType =  function (name) {
		return types[name];
	};
}

manager = new TypesManager();

function isInteger(value) {
    var n = ~~parseNumber(value);
    return String(n) === value.toString();
}

function isFloat(value) {
	return !isNaN(value);
}

function parseNumber(value) {
	return Number(value);
}

// Add default types
// TODO add constraints, separate to a different file
manager.registerType('integer', [ isInteger ], parseNumber);
manager.registerType('float', [ isFloat ], parseNumber);
manager.registerType('string', []);
manager.registerType('imageFile', []);
manager.registerType('text', []);
manager.registerType('color', []);

module.exports = manager;

},{"./type":28}],30:[function(_dereq_,module,exports){
'use strict';

var Common = _dereq_('animates-common');

/**
 *  Helper to serialize objects to json
 *  @class.
 */

function JsonSerializer() {
	var _self = this,
		types = {};

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.serializeArray = function (collection) {
		var json = [];
		for (var i=0; i<collection.length;i++) {
			json.push(_self.serializeObject(collection[i]));
		}
		return json;
	};

	this.deserializeArray = function (jsonArray) {
		var array = [];

		for (var i=0; i<jsonArray.length;i++) {
			var obj = _self.deserializeObject(jsonArray[i]);
			array.push(obj);
		}
		return array;
	};

	this.registerType = function(Constructor) {
		var type = Common.realTypeOf( new Constructor() );
		types[type] = Constructor;
	};

	this.deserializeObject = function (jsonObject) {
		var obj = null;
		if (jsonObject.type) {
			obj = new types[jsonObject.type]();
			obj.fromJSON(jsonObject.data);
		} else {
			obj = jsonObject;
		}

		return obj;
	};

	this.serializeObject = function (object) {
		var data = null,
			json = '';

		if (object.toJSON) {
			data = object.toJSON();
			json = {
				'type' : Common.realTypeOf(object),
				'data' : data
			};
		} else {
			json = JSON.parse(JSON.stringify(object));
		}

		return json;
	};

	this.serializeDictionary = function (collection) {
		var json = { };
		for (var key in collection) {
			if (collection.hasOwnProperty(key))
			{
				json[key] = _self.serializeObject(collection[key]);
			}
		}
		return json;
	};

	this.deserializeDictionary = function (jsonDictionary) {
		var json = {};
		for (var key in jsonDictionary) {
			json[key] = _self.deserializeObject(jsonDictionary[key]);
		}

		return json;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

module.exports = new JsonSerializer();

},{"animates-common":1}],31:[function(_dereq_,module,exports){
'use strict';

var VisualMediaObject = _dereq_('./visualMediaObject'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Shape
 *  @class Represents a Shape.
 */
function Shape (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			name: 'Shape'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());

	this.mediaObject_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.mediaObject_toJSON();
	};

	this.visualMediaObject_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.visualMediaObject_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Shape, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Shape);

module.exports = Shape;

},{"./properties/compositePropertyBuilder":23,"./serialization/jsonSerializer":30,"./visualMediaObject":38,"animates-common":1}],32:[function(_dereq_,module,exports){
/*global Animates */
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = _dereq_('../shape'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Circle
 *  @class Represents a Circle.
 */
function Circle (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			radius : 50,
			name: 'Circle'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('radius', PropertyBuilder)
						.value(options.radius)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add();

		_self.Shape(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['radius'];
	};

	this.shape_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.shape_toJSON();
	};

	this.shape_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.shape_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Circle, Shape, 'Shape');

JsonSerializer.registerType(Circle);

module.exports = Circle;

},{"../properties/compositePropertyBuilder":23,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"../shape":31,"animates-common":1}],33:[function(_dereq_,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = _dereq_('../shape'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Rectangle
 *  @class Represents a Rectangle.
 */
function Rectangle (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			height : 100,
			width : 100,
			name: 'Rectangle'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('height', PropertyBuilder)
						.value(options.height)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('width', PropertyBuilder)
						.value(options.width)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add();

		_self.Shape(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['height', 'width'];
	};

	this.shape_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.shape_toJSON();
	};

	this.shape_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.shape_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Rectangle, Shape, 'Shape');

JsonSerializer.registerType(Rectangle);

module.exports = Rectangle;

},{"../properties/compositePropertyBuilder":23,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"../shape":31,"animates-common":1}],34:[function(_dereq_,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var Shape = _dereq_('../shape'),
	JsonSerializer = _dereq_('../serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('../properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('../properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Triangle
 *  @class Represents a Triangle.
 */
function Triangle (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			height : 100,
			width : 100,
			name: 'Triangle'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('height', PropertyBuilder)
						.value(options.height)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('width', PropertyBuilder)
						.value(options.width)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add();

		_self.Shape(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['height', 'width'];
	};

	this.shape_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.shape_toJSON();
	};

	this.shape_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.shape_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Triangle, Shape, 'Shape');

JsonSerializer.registerType(Triangle);

module.exports = Triangle;

},{"../properties/compositePropertyBuilder":23,"../properties/propertyBuilder":27,"../serialization/jsonSerializer":30,"../shape":31,"animates-common":1}],35:[function(_dereq_,module,exports){
'use strict';

var MediaObject = _dereq_('./mediaObject'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Sound
 *  @class Represents a Sound.
 */
function Sound (options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			volume : 100,
			source : '',
			name : 'Sound'
		},
		properties;

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('volume', PropertyBuilder)
						.value(options.volume)
						.type('integer')
					.add()
					.property('source', PropertyBuilder)
						.value(options.source)
						.type('string')
					.add();

		_self.MediaObject(options, propBuilder); // Call base constructor
	}());

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Sound, MediaObject, 'MediaObject');

module.exports = Sound;

},{"./mediaObject":17,"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"animates-common":1}],36:[function(_dereq_,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = _dereq_('./visualMediaObject'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new Text
 *  @class Represents a Text.
 */
function Text (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			fontSize : 30,
			fontWeight : 'normal',
			fontFamily : 'Times New Roman',
			fontStyle : 'normal',
			textDecoration : '',
			text : 'text',
			name : 'Text'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('fontSize', PropertyBuilder)
						.value(options.fontSize)
						.type('integer')
					.add()
					.property('fontWeight', PropertyBuilder)
						.value(options.fontWeight)
						.type('string')
						.strictValues(['normal', 'bold'])
					.add()
					.property('fontFamily', PropertyBuilder)
						.value(options.fontFamily)
						.type('string')
						.strictValues(['Times New Roman', 'Verdana', 'Georgia', 'Arial', 'Courier New'])
					.add()
					.property('fontStyle', PropertyBuilder)
						.value(options.fontStyle)
						.type('string')
						.strictValues(['normal', 'italic', 'oblique'])
					.add()
					.property('textDecoration', PropertyBuilder)
						.value(options.textDecoration)
						.type('string')
						.strictValues(['', 'underline', 'overline', 'line-through'])
					.add()
						.property('text', PropertyBuilder)
						.value(options.text)
						.type('text')
					.add();

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['fontSize'];
	};

	this.visualMediaObject_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.visualMediaObject_toJSON();
	};

	this.visualMediaObject_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.visualMediaObject_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Text, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Text);

module.exports = Text;

},{"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"./serialization/jsonSerializer":30,"./visualMediaObject":38,"animates-common":1}],37:[function(_dereq_,module,exports){
'use strict';

var MediaTimeline = _dereq_('./mediaTimeline'),
	MultiPointMoveEffect = _dereq_('./effects/multiPointMoveEffect'),
	MultiPointRotateEffect = _dereq_('./effects/multiPointRotateEffect'),
	MultiPointScaleEffect = _dereq_('./effects/multiPointScaleEffect'),
	MultiPointRadiusScaleEffect = _dereq_('./effects/multiPointRadiusScaleEffect'),
	MultiPointFontSizeScaleEffect = _dereq_('./effects/multiPointFontSizeScaleEffect'),
	MultiPointWidthAndHeightScaleEffect = _dereq_('./effects/multiPointWidthAndHeightScaleEffect'),
	JsonSerializer = _dereq_('./serialization/jsonSerializer');

/**
 *  Creates a new Timeline
 *  @class Represents a Timeline.
 */
function Timeline (options) {
	var _self = this,
		mediaTimelineCollection = [];

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	function addDefaultMoveEffect(mediaTimeline, mediaObject) {
		var defaultMoveEffect = new MultiPointMoveEffect();

		defaultMoveEffect.updateProperties(0, {
			'position.x' : mediaObject.getProperty('position.x'),
			'position.y' : mediaObject.getProperty('position.y')
		});

		mediaTimeline.addEffect(defaultMoveEffect);
	}

	function addDefaultRotateEffect(mediaTimeline, mediaObject) {
		var defaultRotateEffect = new MultiPointRotateEffect();

		defaultRotateEffect.updateProperties(0, {
			'angle' : mediaObject.getProperty('angle')
		});

		mediaTimeline.addEffect(defaultRotateEffect);
	}

	function createMultipointEffectInstance(scalableProperties) {
		if (scalableProperties.indexOf('radius') >= 0) {
			return new MultiPointRadiusScaleEffect();
		}

		if (scalableProperties.indexOf('fontSize') >= 0) {
			return new MultiPointFontSizeScaleEffect();
		}

		if (scalableProperties.indexOf('width') >= 0 && scalableProperties.indexOf('height') >= 0 ) {
			return new MultiPointWidthAndHeightScaleEffect();
		}
	}

	function addDefaultScaleEffect(mediaTimeline, mediaObject) {
		var scalableProperties = mediaObject.getScalableProperties && mediaObject.getScalableProperties(),
			scalableData = {};

		if (scalableProperties) {
			for (var i = 0; i < scalableProperties.length; i++) {
				scalableData[scalableProperties[i]] = mediaObject.getProperty(scalableProperties[i]);
			}

			if (scalableProperties.length > 0) {
				var defaultScaleEffect = createMultipointEffectInstance(scalableProperties);
				if (defaultScaleEffect) {
					defaultScaleEffect.updateProperties(0, scalableData);

					mediaTimeline.addEffect(defaultScaleEffect);
				}
			}
		}
	}

	/**
	 * Add a new media timeline element related
	 * @param {object} mediaTimeline the media timeline to be added.
	 * @return {object} The corresponding mediaTimeline object
	 */
	this.addMediaTimeline =  function addMediaTimeline(mediaTimeline) {
		if (mediaTimeline !== undefined) {
			mediaTimelineCollection.push(mediaTimeline);
			return mediaTimeline;
		}

		return undefined;
	};

	/**
	 * Add a new media timeline element related with the media object passed by parameter
	 * @param {object} mediaObject the media object to be added.
	 * @return {object} The corresponding mediaTimeline object
	 */
	this.addMediaObject = function addMediaObject(mediaObject) {
		// Generate a new MediaTimeline using the mediaObject data.
		if (mediaObject !== undefined) {
			var mediaTimeline,
				i,
				mediaObjectId = mediaObject.getGuid();

			for (i = mediaTimelineCollection.length - 1; i >= 0 && !mediaTimeline; i--) {
				if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId) {
					mediaTimeline = mediaTimelineCollection[i];
				}
			}

			if (!mediaTimeline) {
				mediaTimeline = new MediaTimeline({ mediaObject : mediaObject });

				addDefaultMoveEffect(mediaTimeline, mediaObject);
				addDefaultRotateEffect(mediaTimeline, mediaObject);
				addDefaultScaleEffect(mediaTimeline, mediaObject);

				mediaTimelineCollection.push(mediaTimeline);
			}

			return mediaTimeline;
		}

		return undefined;
	};

	/**
	 * Remove a media object element and its related media timeline.
	 * @param {string} mediaObjectId the id of the media object element that will be removed.
	 */
	this.removeMediaObject = function removeMediaObject(mediaObjectId) {
		var i;
		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			if (mediaTimelineCollection[i].getMediaObjectId() === mediaObjectId) {
				mediaTimelineCollection.splice(i, 1);
			}
		}
	};

	/**
	 * Returns the media timelines collection.
	 */
	this.getMediaTimelines = function getMediaTimelines() {
		return mediaTimelineCollection;
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
			if (current.getMediaObjectId() === mediaObjectId) {
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
	 * Calculates all the media frames for the current tick number.
	 * @param {integer} currentTick The current tick number.
	 * @return {MediaFrameArray} The media frames for the current tick number.
	 */
	this.getMediaFrames = function getMediaFrames(currentTick) {
		var elements = [], i;

		for (i = mediaTimelineCollection.length - 1; i >= 0; i--) {
			var mediaFrame = mediaTimelineCollection[i].getMediaFrameFor(currentTick);
			if (mediaFrame) {
				elements.push(mediaFrame);
			}
		}

		return elements;
	};

	/**
	 * Calculates the media frame for the current tick number.
	 * @param {integer} currentTick The current tick number.
	 * @param {string} mediaObjectId the id of the media object element that will be removed.
	 * @return {MediaFrameArray} The media frames for the current tick number.
	 */
	this.getMediaFrameFor = function getMediaFrame(mediaObjectId, currentTick) {
		var mediaTimeline = _self.getMediaTimeline(mediaObjectId);
		return mediaTimeline ? mediaTimeline.getMediaFrameFor(currentTick) : undefined;
	};

	this.toJSON = function toJSON() {
		var ser =	{
				'mediaTimelines' : JsonSerializer.serializeArray(mediaTimelineCollection)
			};

		return ser;
	};

	this.fromJSON = function fromJSON(json) {
		mediaTimelineCollection = JsonSerializer.deserializeArray(json.mediaTimelines);
	};

	/**
	 *  Constructor
	 */
	(function postInit() {
	}());

}

JsonSerializer.registerType(Timeline);

module.exports = Timeline;

},{"./effects/multiPointFontSizeScaleEffect":7,"./effects/multiPointMoveEffect":8,"./effects/multiPointRadiusScaleEffect":9,"./effects/multiPointRotateEffect":10,"./effects/multiPointScaleEffect":11,"./effects/multiPointWidthAndHeightScaleEffect":12,"./mediaTimeline":18,"./serialization/jsonSerializer":30}],38:[function(_dereq_,module,exports){
/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var MediaObject = _dereq_('./mediaObject'),
	PropertyBuilder = _dereq_('./properties/propertyBuilder'),
	CompositePropertyBuilder = _dereq_('./properties/compositePropertyBuilder'),
	Common = _dereq_('animates-common');

/**
 *  Creates a new VisualMediaObject
 *  @class Represents a Shape.
 */
function VisualMediaObject (options, builder) {

	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			position : {
				x : 0,
				y : 0,
				z : 0
			},
			opacity: 1,
			border : {
				type : 'none',
				color : '#000000',
				width : 0
			},
			fill : '#f0f0f0',
			angle : 0,
		};

	/**
	 *  Constructor
	 */
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('opacity', PropertyBuilder)
						.value(options.opacity)
						.type('float')
						.constraint(function (val) { return (val >= 0 && val <= 1); })
					.add()
					.property('angle',PropertyBuilder)
						.value(options.angle)
						.type('float')
						.constraint(function (val) { return (val >= 0 && val <= 360); })
					.add()
					.property('fill',PropertyBuilder)
						.value(options.fill)
						.type('color')
					.add()
					.property('position', CompositePropertyBuilder)
						.property('x', PropertyBuilder)
							.type('float')
							.value(options.position.x)
						.add()
						.property('y', PropertyBuilder)
							.type('float')
							.value(options.position.y)
						.add()
						.property('z', PropertyBuilder)
							.type('float')
							.constraint(function (val) { return val >= 0; })
							.value(options.position.z)
						.add()
					.add()
					.property('border', CompositePropertyBuilder)
						.property('type', PropertyBuilder)
							.type('string')
							.strictValues(['none', 'dotted', 'dashed', 'solid'])
							.value(options.border.type)
						.add()
						.property('width', PropertyBuilder)
							.type('float')
							.value(options.border.width)
						.add()
						.property('color', PropertyBuilder)
							.type('color')
							.value(options.border.color)
						.add()
					.add();

		_self.MediaObject(options, propBuilder); // Call base constructor
	}());

	this.mediaObject_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.mediaObject_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());

}

Common.inherits(VisualMediaObject, MediaObject, 'MediaObject');

module.exports = VisualMediaObject;

},{"./mediaObject":17,"./properties/compositePropertyBuilder":23,"./properties/propertyBuilder":27,"animates-common":1}]},{},[19])
(19)
});