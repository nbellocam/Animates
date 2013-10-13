/**
 * @namespace animates
 */
var animates = {};

/**
 * @namespace animates.common
 */
animates.common = {};

/**
 * Creates an object that represents the structure of a js namespace
 * 
 * @memberof animates.common
 * @param {string} namespaceString The namespace hierarchy separated by dots i.e 'App.model'.
 */
animates.common.namepsace = function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    return parent;
};

/**
 *  Gets the real type of an object
 *
 *  @memberof animates.common
 *  @param {Object} o The object we want to know the type of
 */
animates.common.typeOf = function(o) {
    if (o == null || o == undefined || o.constructor == null || o.constructor == undefined)
    {
        return null;
    }

    var s = Object.prototype.toString.call(o).match(/^\[object (.*)\]$/)[1].toLowerCase();
    var supDataTypes = ['array', 'string', 'function', 'number', 'date', 'boolean', 'object'];
    (supDataTypes.indexOf(s) == -1) ? ((s.indexOf('html') == -1) ? s = 'object' : s = 'dom') : s;
    
    return s;
};

/**
 *  Creates an inherited class of a given parent
 *
  * @memberof animates.common
 *  @param {Object} descendant The child to make inherit 
 *  @param {Object} parent The parent where to inherit from 
 */
animates.common.inherits = function(descendant, parent, parentName) 
{ 
    var sConstructor = parent.constructor.toString().toLowerCase(); 
    var aMatch = sConstructor.match( /\s*function (.*)\(/ ); 
	
	if ( aMatch != null ) 
	{
		if ( aMatch[1] == '' || aMatch[1] == 'function' ) 
		{
			if ( typeof(parentName) == 'undefined' )
			{
				descendant.prototype['base'] = parent;
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
        if ( m != 'base' ) descendant.prototype[m] = parent.prototype[m]; 
    }
};

/**
 *  Gets a clone from a given object
 *
 *  @memberof animates.common
 *  @param {Object} o The object we want to clone
 *  @return The clone of the object
 */
animates.common.clone = function(o)
{
	var clonePack = { original: o };
	var cloned = $.extend(true, {}, clonePack);
	
	return cloned.original;
};

/**
 *  Gets a new short GUID string
 *
 * @memberof animates.common
 * @return The new short GUID
 */
animates.common.createShortGuid = function ()
{
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

/**
 *  Gets a new GUID string
 *
 * @memberof animates.common
 * @return The new GUID
 */
animates.common.createGuid = function ()
{
	var S4 = function() { return animates.common.createShortGuid(); };
    return ( S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4() );
};