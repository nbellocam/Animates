/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	Common = require('animates-common');

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
	(function init() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('fontSize', PropertyBuilder)
						.value(options.fontSize)
						.type('integer')
					.add()
					.property('fontWeight', PropertyBuilder)
						.value(options.fontWeight)
						.type('string')
						.constraint(function (val) { return ['normal', 'bold'].indexOf(val) >= 0; })
					.add()
					.property('fontFamily', PropertyBuilder)
						.value(options.fontFamily)
						.type('string')
						.constraint(function (val) { return ['Times New Roman', 'Verdana', 'Georgia', 'Arial'].indexOf(val) >= 0; })
					.add()
					.property('fontStyle', PropertyBuilder)
						.value(options.fontStyle)
						.type('string')
						.constraint(function (val) { return ['normal', 'italic', 'oblique'].indexOf(val) >= 0; })
					.add()
					.property('textDecoration', PropertyBuilder)
						.value(options.textDecoration)
						.type('string')
						.constraint(function (val) { return ['', 'underline', 'overline', 'line-through'].indexOf(val) >= 0; })
					.add()
						.property('text', PropertyBuilder)
						.value(options.text)
						.type('text')
					.add();

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Text, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Text);

module.exports = Text;
