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
