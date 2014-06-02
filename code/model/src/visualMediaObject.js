/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */
'use strict';

var MediaObject = require('./mediaObject'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	Common = require('animates-common');

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
				color : '#000000'
			},
			fill : '#f0f0f0',
			angle : 0,
		};

	/**
	 *  Constructor
	 */ 
	(function init() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('opacity')
						.value(options.opacity)
						.type('float')
						.constraint(function (val) { return (val >= 0 && val <= 1); })
					.add()
					.property('angle')
						.value(options.angle)
						.type('float')
						.constraint(function (val) { return (val >= 0 && val <= 360); })
					.add()
					.property('fill')
						.value(options.fill)
						.type('color')
					.add()
					.propertyArray('position')
						.property('x')
							.type('float')
							.value(options.position.x)
						.add()
						.property('y')
							.type('float')
							.value(options.position.y)
						.add()
						.property('z')
							.type('float')
							.value(options.position.z)
						.add()
					.add()
					.propertyArray('border')
						.property('type')
							.type('string')
							.value(options.border.type)
						.add()
						.property('color')
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

}

Common.inherits(VisualMediaObject, MediaObject, 'MediaObject');

module.exports = VisualMediaObject;
