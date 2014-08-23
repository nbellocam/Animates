'use strict';

var Common = require('animates-common');

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
