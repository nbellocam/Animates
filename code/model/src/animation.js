'use strict';

var Canvas = require('./canvas'),
	Timeline = require('./timeline'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Common = require('animates-common');

/**
 *  Creates a new Animation.
 *  @class Represents an Animation.
 */
function Animation (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		updateObservers = {},
		loadCompleteObservers = {};

	_self.canvas = options.canvas || new Canvas();
	_self.timeline = options.timeline || new Timeline();

	function applyShapeCreateOperation(opParams) {
		var mediaTimeline = _self.timeline.addMediaObject(opParams.mediaObject);
		if (mediaTimeline) {
			mediaTimeline.setStartTick(opParams.tick);
			return true;
		}

		return false;
	}

	function applyShapeUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline) {
			var mediaObject = mediaTimeline.getMediaObject();
			mediaObject.setProperties(opParams.properties);
			return true;
		}

		return false;
	}

	function applyShapeRemoveOperation(opParams) {
		if (_self.timeline.getMediaTimeline(opParams.mediaObjectId)) {
			_self.timeline.removeMediaObject(opParams.mediaObjectId);
			return true;
		}

		return false;
	}

	function applyEffectCreateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline) {
			mediaTimeline.addEffect(opParams.effect);
			return true;
		}

		return false;
	}

	function applyEffectUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline) {
			var effect = mediaTimeline.getEffect(opParams.effectId);

			if (effect) {
				effect.setOptions(opParams.options);
				return true;
			}

			return false;
		}

		return false;
	}

	function applyEffectRemoveOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline && mediaTimeline.getEffect(opParams.effectId)) {
			mediaTimeline.removeEffect(opParams.effectId);

			return true;
		}

		return false;
	}

	function applyMediaFrameUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			newProperty, updateResult, notUpdatedProperties;

		if (mediaTimeline) {
			updateResult = mediaTimeline.updateEffectsThatMatch(opParams.tick, opParams.updatedProperties);
			notUpdatedProperties = Common.filterObject(opParams.updatedProperties, updateResult.pendingProperties);

			if (updateResult.newProperties) {
				for(newProperty in updateResult.newProperties) {
					opParams.updatedProperties[newProperty] = updateResult.newProperties[newProperty];
				}
			}

			if (!Common.isEmpty(notUpdatedProperties)) {
				var mediaObject = mediaTimeline.getMediaObject();
				mediaObject.setProperties(notUpdatedProperties);
			}

			return true;
		}

		return false;
	}

	function applyShapeOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyShapeCreateOperation(opParams);
			case 'Update':
				return applyShapeUpdateOperation(opParams);
			case 'Remove':
				return applyShapeRemoveOperation(opParams);
			default:
				return false;
		}
	}

	function applyEffectOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyEffectCreateOperation(opParams);
			case 'Update':
				return applyEffectUpdateOperation(opParams);
			case 'Remove':
				return applyEffectRemoveOperation(opParams);
			default:
				return false;
		}
	}

	function applyMediaFrameOperation(operation, opParams) {
		switch (operation) {
			case 'Update':
				return applyMediaFrameUpdateOperation(opParams);
			default:
				return false;
		}
	}

	this.applyOperation = function applyOperation(target, operation, opParams, context) {
		if (target && operation && opParams) {
			var result = false;
			switch (target) {
				case 'Shape':
					result = applyShapeOperation(operation, opParams);
					break;
				case 'Effect':
					result = applyEffectOperation(operation, opParams);
					break;
				case 'MediaFrame':
					result = applyMediaFrameOperation(operation, opParams);
					break;
				default:
					return;
			}

			if (result) {
				for (var observerId in updateObservers) {
					if (updateObservers.hasOwnProperty(observerId)) {
						if (!context || !context.sender || context.sender !== observerId) {
							updateObservers[observerId](target, operation, opParams, context);
						}
					}
				}
			}
		}
	};

	this.addUpdateObserver = function addUpdateObserver(observerId, observerFunction) {
		updateObservers[observerId] = observerFunction;
	};

	this.removeUpdateObserver = function removeUpdateObserver(observerId) {
		if (updateObservers.hasOwnProperty(observerId)) {
			delete updateObservers[observerId];
		}
	};

	this.addLoadCompleteObserver = function addLoadCompleteObserver(observerId, observerFunction) {
		loadCompleteObservers[observerId] = observerFunction;
	};

	this.removeLoadCompleteObserver = function removeLoadCompleteObserver(observerId) {
		if (loadCompleteObservers.hasOwnProperty(observerId)) {
			delete loadCompleteObservers[observerId];
		}
	};

	this.loadProject = function loadProject(json) {
		if (json && json.type && json.data) {
			var animationData = json.data;
			if (animationData.timeline.type && animationData.timeline.data) {
				_self.timeline.fromJSON(animationData.timeline.data);
			}

			if (animationData.canvas.type && animationData.canvas.data) {
				_self.canvas.fromJSON(animationData.canvas.data);
			}

			for(var observerId in loadCompleteObservers) {
				if (loadCompleteObservers.hasOwnProperty(observerId)) {
					loadCompleteObservers[observerId]();
				}
			}
		}
	};

	this.toJSON = function () {
		var ser =	{
						'canvas' : JsonSerializer.serializeObject(_self.canvas),
						'timeline' : JsonSerializer.serializeObject(_self.timeline)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		_self.timeline = JsonSerializer.deserializeObject(json.timeline);
		_self.canvas = JsonSerializer.deserializeObject(json.canvas);
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());
}

JsonSerializer.registerType(Animation);

module.exports = Animation;
