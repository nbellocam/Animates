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
	Animation : require('./animation'),

	// media objects
	Shape : require('./shape'),
	Rectangle : require('./shapes/rectangle'),
	Photo : require('./photo'),
	Sound : require('./sound'),

	// effects
	MoveEffect : require('./effects/moveEffect'),
	Path : require('./utils/path'),

	JsonSerializer: require('./serialization/jsonSerializer'),
};

 module.exports = model;