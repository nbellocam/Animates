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
 * @param  {Object} defaults	The default values
 * @param  {Object} source		The current object to be extended
 * @return {Object}             The extended object with default values
 */
function extend (defaults, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor &&
			source[property].constructor === Object) {
			defaults[property] = defaults[property] || {};
			arguments.callee(defaults[property], source[property]);
		} else {
			defaults[property] = source[property];
		}
	}
	return defaults;
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
function clone (o)
{
	var clonePack = { original: o };
	var cloned = $.extend(true, {}, clonePack);
	
	return cloned.original;
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
