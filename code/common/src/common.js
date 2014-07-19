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
function filterObject(originalObject, listOfFilterKeys) {
  var result = {};

  for (var key in originalObject) {
    if (originalObject.hasOwnProperty(key) && (!listOfFilterKeys || listOfFilterKeys.indexOf(key) === -1)) {
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
