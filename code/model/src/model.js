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
	Circle : require('./shapes/circle'),
	Text : require('./text'),
	Photo : require('./photo'),
	Sound : require('./sound'),

	// effects
	MoveEffect : require('./effects/moveEffect'),
	FadeEffect: require('./effects/fadeEffect'),

	JsonSerializer: require('./serialization/jsonSerializer'),
};

 module.exports = model;
