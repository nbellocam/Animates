'use strict';


function CompositeProperty () {
	var properties = {},
		_self = this;

	this.add = function add (name, property) {
		properties[name] = property;
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
				if (property.get)
				{
					property = property.get(parts[i]);
				} else {
					throw new Error("Property '" + parts[i] + "' could not be found.");	
				}
			}

			if (property.value) {
				return property;
			} else {
				throw new Error("Property '" + name + "' could not be found.");
			}
		} else {
			throw new Error("Property '" + parts[0] + "' could not be found.");
		}	
	};

	this.getValue = function (name) {
		return _self.get(name).value();
	};

	this.setValue = function (name, value) {
		var property = _self.get(name);
		property.value(value);
	};

	this.names = function () {
		var namesArray = [];

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
}

module.exports = CompositeProperty;